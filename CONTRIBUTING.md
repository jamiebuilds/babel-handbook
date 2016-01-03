# Contributing

### Translating the handbook

The English translation of this handbook is maintained in this repository, for
other translations we use [Crowdin](https://crowdin.com/), if you would like to
contribute to one of the translations you can invite yourself to the Crowdin
Project [here](https://crowdin.com/project/babel-plugin-handbook/invite).

Changes to the English translation will automatically be sent to Crowdin which
will notify translators of changes. When translations are completed, they will be
built and sent back to GitHub. There's a short delay, but if any part of this
process does not happen, please open an issue.

Once you set up your account on Crowdin you should be taken to
[this page](https://crowdin.com/project/babel-plugin-handbook).

Click on the language you would like to contribute to and then click on
"README.md". You will be taken to the translation editor.

![Crowdin Translation Editor](https://cloud.githubusercontent.com/assets/952783/12076790/291e6cac-b170-11e5-989e-4cb2925e2b38.png)

On the left side you can see the handbook. In red are missing translations,
light green are translated, and dark green are translated and verified.

If you click on one of the sections, it will bring it up in the center panel
where you can enter a translation and save it.

If you click on a section with text formatting or links, Crowdin has a special
syntax for matching up the formatting.

![Crowdin translation format](https://cloud.githubusercontent.com/assets/952783/12076803/c1a83a52-b170-11e5-9925-329b129be959.png)

If you match the numbered `<0>...</0>` delimiters, Crowdin will build the final
translation with all the formatting and links of the original.

Once a translation is finished, it should only be a few minutes before the
changes get pushed to GitHub automatically.
