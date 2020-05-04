---
title: Visual Studio Gradebook
category: project
description: Simplifying grading code in visual studio
logo: "/assets/vsgradebook.png"
layout: post
buttons:
  - title: "Source Code"
    url: https://github.com/chrisevans9629/VsGradeBook
  - title: "VS Marketplace"
    url: "https://marketplace.visualstudio.com/items?itemName=EvansSoftware.VsGradeBook"
---

Learning to program is hard.  Dedication is required to master software development.  Students often struggle with the lack of feedback from their code.  How do you know if you are doing it right?  Professors also struggle to grade code.  Grading student's code requires professors to download it, compile it, run it, and review the source code.  Visual Studio Gradebook solves all these problems by providing a unit test style feedback system for students and publishing of their code right in visual studio.  Professors can view student's code and see the results without the need to download their project or running it.  It will also show how many tests the student's code passed.  They can also see if the code was plagarized.

## Example

Below is an example from the [documentation](https://github.com/chrisevans9629/VsGradeBook)  

Tax System (Multiple Inputs Example)
Create a program that takes the price of an item and then the percent of sales tax as inputs in that order. The program should then output the original price, the tax percent, the tax cost, and the price + tax cost.

| Inputs | Outputs |
| --- | --- |
| 10,10 | $10,10%,$1,$11
| 20,10 | $20,10%,$2,$22
| 100,15 | $100,15%,$15,$115

```csharp
using System;

class MainClass
{
    static void Main()
    {
        Console.WriteLine("Enter price");
        var price = double.Parse(Console.ReadLine());
        Console.WriteLine("Enter tax percent");
        var tax = double.Parse(Console.ReadLine());

        Console.WriteLine($"Price: ${price}");
        Console.WriteLine($"Tax Percent: {tax}%");
        Console.WriteLine($"Tax Cost: ${tax/100 * price}");
        Console.WriteLine($"Total Cost: ${price + (tax/100 * price)}");
    }

}
```

![result](/assets/images/vsgradebook_taxsystemsubmissionview.png)

## How does this work?

VS Gradebook uses roslyn analyzers to find all the calls to `Console` and replaces it with my own class with the same name.  I can then inject the input into the ReadLines and read the output from the WriteLines.  This allows me to provide a percent of passing.

## Inspiration

This was done as an honors project at Pittsburg State University my senior year.  I wanted to create something that is new and useful.