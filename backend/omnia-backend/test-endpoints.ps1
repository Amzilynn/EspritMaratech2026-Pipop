$baseUrl = "http://localhost:3000"

function Test-Endpoint {
    param($Method, $Uri, $Body = $null, $Headers = @{})
    $jsonBody = if ($Body) { $Body | ConvertTo-Json -Depth 10 } else { $null }
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$Uri" -Method $Method -Body $jsonBody -Headers $Headers -ContentType "application/json"
        Write-Host "[OK] $Method $Uri" -ForegroundColor Green
        return $response
    } catch {
        $statusCode = $_.Exception.Response.StatusCode
        if ($statusCode -eq "Conflict" -and $Uri -eq "/auth/register") {
            Write-Host "[SKIP] $Method $Uri - User already exists" -ForegroundColor Cyan
            return "ALREADY_EXISTS"
        }
        Write-Host "[FAIL] $Method $Uri - Status: $statusCode - $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errBody = $reader.ReadToEnd()
            $errBody | Out-File "error.json"
            Write-Host "Full error written to error.json" -ForegroundColor Yellow
        }
        return $null
    }
}

Write-Host "`n--- PHASE 1: Authentication & User Registration ---" -ForegroundColor Cyan
$regBody = @{
    email = "test-volunteer@omnia.tn"
    password = "password123"
    firstName = "Test"
    lastName = "Volunteer"
    roleName = "BENEVOLE"
}
$null = Test-Endpoint -Method Post -Uri "/auth/register" -Body $regBody

# Login Admin
$loginResAdmin = Test-Endpoint -Method Post -Uri "/auth/login" -Body @{ email = "admin@omnia.tn"; password = "password123" }
$adminToken = $loginResAdmin.access_token
$adminHeaders = @{ Authorization = "Bearer $adminToken" }

# Login Volunteer
$loginResVol = Test-Endpoint -Method Post -Uri "/auth/login" -Body @{ email = "test-volunteer@omnia.tn"; password = "password123" }
$volToken = $loginResVol.access_token
$volHeaders = @{ Authorization = "Bearer $volToken" }

Write-Host "`n--- PHASE 2: User Management (Admin Only) ---" -ForegroundColor Cyan
$users = Test-Endpoint -Method Get -Uri "/users" -Headers $adminHeaders
$testUser = $users | Where-Object { $_.email -eq "test-volunteer@omnia.tn" }

if ($testUser) {
    Write-Host "Verifying User ID: $($testUser.id)"
    Test-Endpoint -Method Get -Uri "/users/$($testUser.id)" -Headers $adminHeaders
    Test-Endpoint -Method Patch -Uri "/users/$($testUser.id)" -Body @{ firstName = "Test Updated" } -Headers $adminHeaders
}

Write-Host "`n--- PHASE 3: Beneficiaries (Volunteer/Admin) ---" -ForegroundColor Cyan
$beneBody = @{
    codeFamille = "T-FAM-" + (Get-Random -Minimum 1000 -Maximum 9999)
    nomFamille = "Test Family"
    nbMembres = 4
    latitude = 36.8
    longitude = 10.1
    situationSociale = "Initial social situation."
}
$newBene = Test-Endpoint -Method Post -Uri "/beneficiaires" -Body $beneBody -Headers $volHeaders
if ($newBene) {
    $beneId = $newBene.id
    Test-Endpoint -Method Get -Uri "/beneficiaires/$beneId" -Headers $volHeaders
    Test-Endpoint -Method Patch -Uri "/beneficiaires/$beneId" -Body @{ situationSociale = "Updated situation." } -Headers $volHeaders

    Write-Host "`n--- PHASE 4: Visits & Aid (Volunteer/Manager/Admin) ---" -ForegroundColor Cyan
    $visitBody = @{
        notes = "First test visit notes."
        associations = @(
            @{
                beneficiaryId = $beneId
                aids = @(
                    @{ type = "Food"; natureIntervention = "Distribution"; quantite = 2; unite = "Box" }
                )
            }
        )
    }
    $newVisit = Test-Endpoint -Method Post -Uri "/visits" -Body $visitBody -Headers $volHeaders
    if ($newVisit) {
        $visitId = $newVisit.id
        $aidId = $newVisit.visitBeneficiaires[0].aids[0].id

        Test-Endpoint -Method Get -Uri "/visits/$visitId" -Headers $adminHeaders
        Test-Endpoint -Method Patch -Uri "/visits/$visitId" -Body @{ notes = "Corrected notes." } -Headers $adminHeaders
        Test-Endpoint -Method Patch -Uri "/visits/aids/$aidId" -Body @{ quantite = 99 } -Headers $adminHeaders


        Write-Host "`n--- PHASE 5: Deletion & Cleanup ---" -ForegroundColor Cyan
        # Negative test: Volunteer should NOT be able to delete beneficiaries
        Write-Host "Verification: Volunteer should NOT be able to delete beneficiary (Expecting 403)"
        $unauthRes = Test-Endpoint -Method Delete -Uri "/beneficiaires/$beneId" -Headers $volHeaders
        if ($null -eq $unauthRes) {
            Write-Host "[PASS] Unauthorized access correctly blocked" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] Unauthorized access was NOT blocked" -ForegroundColor Red
        }

        Test-Endpoint -Method Delete -Uri "/visits/aids/$aidId" -Headers $adminHeaders
        Test-Endpoint -Method Delete -Uri "/visits/$visitId" -Headers $adminHeaders
        Test-Endpoint -Method Delete -Uri "/beneficiaires/$beneId" -Headers $adminHeaders
    }
}

Write-Host "`n--- PHASE 6: Audit Logs ---" -ForegroundColor Cyan
$audits = Test-Endpoint -Method Get -Uri "/audit" -Headers $adminHeaders
if ($audits) {
    Write-Host "Recent Audit Trails Summary (Action | Entity | Time):"
    $audits | Select-Object -First 5 | Format-Table action, entity, timestamp
}

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   FULL ENDPOINT VALIDATION COMPLETED   " -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
