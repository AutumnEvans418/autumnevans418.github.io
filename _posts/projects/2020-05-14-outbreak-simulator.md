---
layout: post
title: Simulating an Outbreak
description: Simulating the spread of diseases using the SIR model with vuejs & chartjs
category: project
tags: [vuejs,chartjs,interactive]
logo: /assets/images/outbreak.gif
buttons:
  - title: Source Code
    url: https://github.com/chrisevans9629/chrisevans9629.github.io/blob/master/_includes/virus_simulator.html
---
```Try it out below!```  
The spread of the disease is something that has been studied for a long time, and there are a variety of ways to predict what will happen when a population is exposed to a new disease.  One way of modeling these scenarios is the susceptible, infected, recovered (SIR) model.

The SIR model defines a population into 3 categories.  
- **Susceptible** is the number of people who are at risk of the getting infected.  This assumes that someone is not vaccinated and that they cannot get a disease twice.  
- **Infected** means that someone has the disease and can infect other people.
- **Recovered** is the number of people who no longer can infect other people.

In the model I have created, I have also added a category called 'Dead'.  This splits the recovered category into 'Recovered' and 'Dead' based on the disease's death rate.

## Variables

- Infection chance is how likely someone is to get infected by another person.
- Recovery time is how long it takes for a disease to leave the incubation and symptom period.
- Death rate is how many of the infected will die from the symptoms.
- r0 (R-naught) tells you how many people will get infected by one person per day.

## Try it out!
Go ahead and change the variables around and see what you get.  Try changing the dropdown to see pre-defined outbreaks.
<div class="break"></div>
{% include virus_simulator.html %}

## Resources

- [Compartmental Models in Epidemiology](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology)
- [Model the spread of disease](https://www.maa.org/press/periodicals/loci/joma/the-sir-model-for-spread-of-disease-the-differential-equation-model)