
$file = ".\scripts\atom.xml"

Invoke-WebRequest "https://chrisevans9629.github.io/feed.xml" -OutFile $file
[xml]$result = Get-Content $file -Encoding UTF8 -Raw

$entries = $result.GetElementsByTagName("entry")

function GetEntry($entry) {
    $title = $entry.GetElementsByTagName("title")[0].InnerText
    $link = $entry.GetElementsByTagName("link")
    $ref = $link[0].GetAttribute("href")
    $summary = $entry.GetElementsByTagName("summary")[0].InnerText
    # get the first two sentences
    $sum = $summary.Split(".")[0] + "." + $summary.Split(".")[1] + "..."
    return @{title=$title;ref=$ref;summary=$sum}
}

$blog = GetEntry $entries[0]


# $array = [System.Collections.ArrayList]@()

# foreach ($entry in $entries) {
#     $r = GetEntry $entry
#     # prevents printing out 0,1,2,3...
#     $n = $array.Add($r)
# }


$file = $PSScriptRoot + "/lastblog.txt"

$lastblog = Get-Content $file

#if($lastblog -ne $blog.title)
#{
    "installing python requirements!"

    & pip install facebook-sdk
    & pip install selenium
    "posting update"
    # $blog

    $prFile = $PSScriptRoot + "/promote.py"

    & python $prFile

    $blog.title > $file

    & git diff
    & git config --global user.email "readme-bot@example.com"
    & git config --global user.name "README-bot"
    #& git add -A
    #& git commit -m "Posted update" > exit 0
    #& git push
#}



