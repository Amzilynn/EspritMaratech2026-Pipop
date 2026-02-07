$baseUrl = "http://localhost:3000"

# 1. Login
Write-Host "--- Step 1: Login ---" -ForegroundColor Cyan
$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{ email = "admin@omnia.tn"; password = "password123" } | ConvertTo-Json) -ContentType "application/json"
$token = $loginRes.access_token
$headers = @{ Authorization = "Bearer $token" }

# 2. Seed some diverse beneficiaries if needed
Write-Host "`n--- Step 2: Ensuring test data exists ---" -ForegroundColor Cyan
$beneficiaires = Invoke-RestMethod -Uri "$baseUrl/beneficiaires" -Method Get -Headers $headers

if ($beneficiaires.Count -lt 3) {
    Write-Host "Seeding 3 different family profiles..." -ForegroundColor Yellow
    
    # 1. High Vulnerability
    $b1 = @{
        codeFamille = "VULN-HIGH-001"
        nbMembres = 7
        nbEnfants = 5
        nbHandicapes = 1
        revenuMensuel = 150
        typeLogement = "Précaire"
    }
    # 2. Medium Vulnerability
    $b2 = @{
        codeFamille = "VULN-MED-002"
        nbMembres = 4
        nbEnfants = 2
        revenuMensuel = 500
        typeLogement = "Locataire"
    }
    # 3. Low Vulnerability
    $b3 = @{
        codeFamille = "VULN-LOW-003"
        nbMembres = 2
        revenuMensuel = 2000
        typeLogement = "Propriétaire"
    }

    Invoke-RestMethod -Uri "$baseUrl/beneficiaires" -Method Post -Body ($b1 | ConvertTo-Json) -Headers $headers -ContentType "application/json" | Out-Null
    Invoke-RestMethod -Uri "$baseUrl/beneficiaires" -Method Post -Body ($b2 | ConvertTo-Json) -Headers $headers -ContentType "application/json" | Out-Null
    Invoke-RestMethod -Uri "$baseUrl/beneficiaires" -Method Post -Body ($b3 | ConvertTo-Json) -Headers $headers -ContentType "application/json" | Out-Null
    Write-Host "[OK] Test families seeded." -ForegroundColor Green
}

# 3. Get Insights
Write-Host "`n--- Step 3: Fetching AI Insights & Vulnerability Scores ---" -ForegroundColor Cyan
$insights = Invoke-RestMethod -Uri "$baseUrl/intelligence/insights" -Method Get -Headers $headers
$insights | ConvertTo-Json -Depth 10

Write-Host "`n[ANALYSIS]" -ForegroundColor White
Write-Host "System Average Vulnerability: $($insights.systemSummary.averageVulnerability)%" -ForegroundColor Gray
Write-Host "Top Priority Family Score: $($insights.priorityQueue[0].score) points" -ForegroundColor Yellow

if ($insights.medicalTrends.Count -gt 0) {
    Write-Host "Detected Medical Trend: $($insights.medicalTrends[0].trend)" -ForegroundColor Magenta
} else {
    Write-Host "No clear medical trends detected yet (need more OCR data)." -ForegroundColor DarkGray
}
