$env:hello + ' from powershell'

$posts = Get-ChildItem "_posts" -Recurse `
    | Where-Object {$_.Name -like "*.md" -or $_.Name -like "*.html" } `
    | Select-Object -Property Name, @{ Name= 'content'; Expression={ $_ | Get-Content } } `
    | Where-Object {$_.content.Contains('published: false') -ne $true } `
    | Sort-Object -Property Name -Descending `
    | Select-Object -First 1

$posts

$file = ".\scripts\atom.xml"

Invoke-WebRequest "https://chrisevans9629.github.io/feed.xml" -OutFile $file
[xml]$result = Get-Content $file -Encoding UTF8 -Raw

$entries = $result.GetElementsByTagName("entry")

$array = [System.Collections.ArrayList]@()

foreach ($entry in $entries) {
    $title = $entry.GetElementsByTagName("title")[0].InnerText
    $link = $entry.GetElementsByTagName("link")
    $ref = $link[0].GetAttribute("href")
    $summary = $entry.GetElementsByTagName("summary")[0].InnerText
    # get the first two sentences
    $sum = $summary.Split(".")[0] + "." + $summary.Split(".")[1] + "..."

    $array.Add({$title;$ref;$sum})
}

$array
