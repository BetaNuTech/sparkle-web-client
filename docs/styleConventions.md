# Style Conventions

- [Technologies](#technologies)
- [Methodologies](#methodologies)
- [Standards](#standards)
- [Helpful Tips](#helpful-tips)

## Technologies 🤓

- [SCSS](https://sass-lang.com/).
- [Normalize.css](https://necolas.github.io/normalize.css/).
- [Autoprefixer](https://github.com/postcss/autoprefixer).
- [CSS Modules](https://github.com/css-modules/css-modules).

## Methodologies 📚

- [BEM](http://getbem.com/)
- [ITCSS](https://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528)
- [OOCSS](https://vanseodesign.com/css/object-oriented-css/)
- [Functional CSS](https://rangle.io/blog/styling-with-functional-css/)

## Standards 📏

- Work in pixels, [output in REM’s](https://medium.com/@hossam.hilal0/rem-vs-em-units-in-css-96d5ac15878e)
- Camel casing of class names.
- Mobile first design: use `@media-query`'s to target larger devices

```scss
.docButton { .. } // Block
.docButton__elBlah // Element
.docButton--redBold // Modifier
```

- Use [SASS placeholders](https://sass-lang.com/documentation/style-rules/placeholder-selectors) to implement Object Oriented CSS. You consume these by `@extend`ing them in your components.

```scss
// Object
%button {
  color: red;
}

// Component
.docButton {
  @extend %button;
}
```

- Avoid `!important` except for utility/trump (aka utility) classes.
- Trumps are where your utility classes go, these overwrite all other selectors.
- In your components do not reference global styles except for trump/utility classes.
- Abstract common animations/transitions into their own directory and include them globally in `app.scss`

## Helpful Tips ✏️

- Trumps are globally accessible, not within css modules.
- Wrap media queries with global SASS mixin: `@media-query(tablet)`
- Don't add CSS classes to `styles/objects`, only `%placeholders`, then `@extend` in components.
