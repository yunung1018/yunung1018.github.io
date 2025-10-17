title: "cat flag"
baseURL: "https://yunung1018.github.io/"
languageCode: 'en-us'
titleCaseStyle: 'none' ## comment this line for forcing capitalized titles on tags
theme: "neopost"

languages:
  en:
    languageCode: en-us
    contentDir: content/en
    languageName: english
    weight: 1
    params:
      sidebar:
        tags:
          enable: true # default = true?
          limit: 2 # limit showcasing only up to this number of tags in bio, defaults to 5
          more-text: "more tags..." # show a hyperlink with this text if there's more tags than tags-limit

      read-more:
        length-limit: 120 # if the text exceeds this number of characters, the read more button will appear to expand the text
        text:
          more: "read more"
          less: "read less"
  # jp:
  #   languageCode: ja-jp
  #   contentDir: content/jp
  #   languageName: 日本語
  #   weight: 2
  #   params:
  #     sidebar:
  #       tags:
  #         enable: true # default = true?
  #         limit: 2 # limit showcasing only up to this number of tags in bio, defaults to 5
  #         more-text: "その他のタグ。。。" # show a hyperlink with this text if there's more tags than tags-limit

  #     read-more:
  #       length-limit: 80 # if the text exceeds this number of characters, the read more button will appear to expand the text
  #       text:
  #         more: "もっと読む"
  #         less: "もっと読む"

permalinks:
  posts: "/posts/:filename/"

params:
  # themes made by neopost: light-blue, dark-blue, light-green, light-yellow, light-pink, light-purple
  # but you can also create your colored theme at "/data/custom_themes.yaml"!
  theme: "meow"
  favicon: "/favicon.ico"
  posts-per-page: 1 # defaults to 5 if not defined
  toc-auto-numbering: false