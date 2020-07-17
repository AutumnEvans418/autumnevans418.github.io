---
title: Visual Studio Gradebook
category: project
description: Simplifying grading code in visual studio
logo: "/assets/images/vsgradebook.png"
layout: post
buttons:
  - title: Source Code
    url: https://github.com/chrisevans9629/VsGradeBook
  - title: VS Marketplace
    url: "https://marketplace.visualstudio.com/items?itemName=EvansSoftware.VsGradeBook"
tags: [downloadable,Visual Studio]
---

Learning to program is hard to learn for beginners and hard to teach.  Students often struggle with the lack of feedback from their code.  How do you know if you are doing it right?  Professors also struggle to grade code.  Grading student's code requires professors to download it, compile it, run it, and review the source code.  Visual Studio Gradebook solves all these problems by providing a unit test style feedback system for students, and provides publishing of student's code right in visual studio.  Professors can view student's code and see the results without the need to download or run their project.  In addition to above Visual Studio Gradebook also checks for plagiarism

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

VS Gradebook uses roslyn analyzers to find all the calls to `Console` and replaces it with my own class with the same name.  I can then inject the input into the `Console.ReadLines` and read the output from the `Console.WriteLines`.  This allows me to provide a percent of passing.

## Inspiration

This was done as an honors project at Pittsburg State University my senior year.  I wanted to create something that is new and useful to students and professors.