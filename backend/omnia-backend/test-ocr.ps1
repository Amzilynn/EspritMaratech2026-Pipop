$baseUrl = "http://localhost:3000"

# 1. Login to get token
Write-Host "--- Step 1: Login ---" -ForegroundColor Cyan
try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{ email = "admin@omnia.tn"; password = "password123" } | ConvertTo-Json) -ContentType "application/json"
    $token = $loginRes.access_token
    $headers = @{ Authorization = "Bearer $token" }
} catch {
    Write-Host "[FAIL] Login failed. Is the server running on $baseUrl?" -ForegroundColor Red
    exit
}

# 2. Check if a test image exists
$imagePath = "test-prescription.jpg" 
if (-not (Test-Path $imagePath)) {
    Write-Host "Warning: test-prescription.jpg not found. Place a JPG/PNG to test OCR." -ForegroundColor Yellow
} else {
    Write-Host "`n--- Step 2: Testing OCR Analysis (Enriched with OpenFDA) ---" -ForegroundColor Cyan
    $resJson = curl.exe -s -X POST "$baseUrl/ocr/analyze" -H "Authorization: Bearer $token" -F "image=@$imagePath"
    $analysis = $resJson | ConvertFrom-Json
    $analysis | ConvertTo-Json -Depth 10
}

# 3. Test Confirmation (Saving enriched data)
Write-Host "`n--- Step 3: Testing OCR Confirmation (Saving) ---" -ForegroundColor Cyan

# Ensure we have at least one beneficiary
$beneficiaires = Invoke-RestMethod -Uri "$baseUrl/beneficiaires" -Method Get -Headers $headers
$beneId = $null

if ($beneficiaires.Count -eq 0) {
    Write-Host "No beneficiaries found. Creating a temporary test beneficiary..." -ForegroundColor Yellow
    $newBeneBody = @{
        codeFamille = "OCR-TEST-" + (Get-Random -Minimum 1000 -Maximum 9999)
        nomFamille = "OCR Test Family"
        nbMembres = 1
    }
    $newBene = Invoke-RestMethod -Uri "$baseUrl/beneficiaires" -Method Post -Body ($newBeneBody | ConvertTo-Json) -Headers $headers -ContentType "application/json"
    $beneId = $newBene.id
    Write-Host "[OK] Created Test Beneficiary: $beneId" -ForegroundColor Green
} else {
    $beneId = $beneficiaires[0].id
    Write-Host "Using existing Beneficiary: $beneId" -ForegroundColor Gray
}

if ($beneId) {
    $confirmBody = @{
        beneficiaryId = $beneId
        rawText = $analysis.rawText
        medications = $analysis.detectedMedications
    }
    
    try {
        $confirmRes = Invoke-RestMethod -Uri "$baseUrl/ocr/confirm" -Method Post -Body ($confirmBody | ConvertTo-Json -Depth 10) -Headers $headers -ContentType "application/json"
        Write-Host "[OK] Confirmation Successful. Record ID: $($confirmRes.id)" -ForegroundColor Green
    } catch {
        Write-Host "[FAIL] Confirmation failed." -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $errBody = $reader.ReadToEnd()
            Write-Host "Error Body: $errBody" -ForegroundColor Red
        }
    }
}
