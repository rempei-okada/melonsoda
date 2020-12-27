import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "ようこそ React と react-i18next へ。": "Welcome to React and react-i18next.",
        言語を切り替え: "change language",
      },
    },
    ja: {
      translation: {
        "NoTitle": "未タイトル",
        "Note": "NOTE",
        "Page": "PAGE",
        "NewPage": "新しいページ",
        "NewNote": "新しいノート",
        "UpdateDateTime": "更新日時",
        "CreationDateTime": "作成日時",
        "DateTime": "日時",
        "Delete": "削除",
        "ConfirmDeleteItem": "[ {item} ] を削除しますか?",
        "ChangeName": "名前を変更",
        "NewName": "新しい名前",
        "CreateNewNote": "ノートを新規作成",
        "Edit":"編集",
        "SelectField":"追加するフィールドを選択してください"
      },
    },
  },
  lng: "ja",
  fallbackLng: "ja",
  interpolation: { escapeValue: false },
});