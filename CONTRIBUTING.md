# Contributing

### Translating the handbook

The english version of this handbook is the only one updated inside the
repository, if you would like to contribute to other languages you must do so
through Crowdin. You can
[invite yourself to our crowdin project here](https://crowdin.com/project/babel-plugin-handbook/invite).

### Downloading updated translations

Note: This is for maintainers who have api access to Crowdin. If you do not have
access to this and you would like for the translations to be updated please open
an issue.

First make sure you have the `crowdin-cli` installed.

```sh
$ gem install crowdin-cli
```

The you can use it to download the latest translations.

```sh
$ CROWDIN_API_KEY=$(CROWDIN_API_KEY) crowdin-cli download
```

Replace `CROWDIN_API_KEY` with the api key on
https://crowdin.com/project/babel-plugin-handbook/settings#integration.
