---
title: Winform MVP
layout: post
category: project
tags: [winforms]
description: Unit Test winforms with mvp pattern
buttons:
  - title: "Source Code"
    url: https://github.com/chrisevans9629/PresenterPatternGenerator
---

Windows Forms is a mature .NET framework, with the unfortunate design of being tightly coupled to the view by default.  This makes winforms really hard to unit test and separate business logic from the view.  My first attempt in separating the view was by using bindings and MVVM.  Unfortunately, I was not satisfied with the binding capabilities of winforms, which is pretty limited without the use of 3rd party libraries and controls, such as DevExpress.  I ended up going with the model-view-presenter pattern and successfully converted forms to use the mvp pattern.  This took a long time, so I eventually wrote a program to generate the starting code for me!  This made it easy for me to migrate code and start unit testing logic and track down bugs.

### Example
Form1 is a form that has 3 controls:
- a listbox
- a textbox
- 2 buttons

Here is how you use the generator:
```csharp
var result = FormPresenterPatternCreator.CreatePresenterPattern<Form1>(new VbLanguage());
```
This is the result:
```csharp
public interface IForm1
{
   ObservableCollection<object> listBox1Property { get; set; }
   object SelectedlistBox1Property { get; set; }
   string textBox1Property { get; set; }
}

public class Form1 : IForm1
{
    ObservableCollection<object> listBox1Property { get => listBox1.DataSource; set => listBox1.DataSource = value; }
    string textBox1Property { get => textBox1.Text; set => textBox1.Text = value; }
    public Form1()
    {
        var presenter = new new Form1Presenter(this)
        button1.Clicked += (s,args) => presenter.button1Method();
        button2.Clicked += (s,args) => presenter.button2Method();
    }
}

public class Form1Presenter
{
    IForm1 _view;
    button1Method() => throw new NotImplementedException();
    button2Method() => throw new NotImplementedException();
    public Form1Presenter()
    {
    }
    public Form1Presenter(IForm1 view)
    {
        _view = view;
    }
}
```

You can see how it works on my [github](https://github.com/chrisevans9629/PresenterPatternGenerator)
