bootstrap-tabdrop
=================

A dropdown tab tool for @twitter bootstrap forked from Stefan Petre's (of eyecon.ro), improvements by @jschab and @josephdburdick

The dropdown tab appears when your tabs do not all fit in the same row.

Original site and examples: http://www.eyecon.ro/bootstrap-tabdrop/ 

Added functionality: Displays the text of an active tab selected from the dropdown list instead of the text option on the dropdown tab (improved).

Added functionality: Allows customizable offset to determine whether tab is overflown or not.

@rkenney fixed the drop down tab not showing the correct text due to the bootstrap event firing after the tabdrop event. The only issue someone may have is if they want to use it with bootstrap v2 since the events are not the same names.

## Requirements

* [Bootstrap](http://twitter.github.com/bootstrap/) 3+
* [jQuery](http://jquery.com/) 1.7.1+

## Example

No additional HTML needed - the script adds it when the dropdown tab is needed. It also supports tabs that have `display: flex`.

Direct javascript:
```javascript
this.$('.nav-tabs').tabdrop();
```

## Use

Call the tabdrop:
```javascript
.tabdrop();
```

Call the tabdrop with options:
```javascript
.tabdrop(options);
```

### Options

#### text 
Type: string

Default: icon 
```html
<i class="icon-align-justify"></i>
```
To change the default value, call
```javascript
.tabdrop({text: "your text here"});
```
when initalizing the tabdrop. The displayed value will change when a tab is selected from the dropdown list.

#### align 
Type: string

Default: right 
```js
$('.nav-tabs').tabdrop({align: 'left'});
```
when initalizing the tabdrop. The tab will align on the left or right. This addresses issues with tabs that have `display: flex`.

#### offsetTop 
Type: integer

Default: 0

#### usingBoostrap3
Type: bool

Default: false

When tabdrop is used with bootstrap 3 the original click event fires before the bs.shown event and the active dropdown item is displayed wrong.
By setting the option usingBoostrap3 to true the layout call will be run after the bootstrap event and the correct active dropdown item text will be shown.
```js
$('.nav-tabs').tabdrop({usingBoostrap3: true});
```

To change the default value, call
```javascript
.tabdrop({offsetTop: N});
```
when initalizing the tabdrop. This determines when tab has to be included in the dropdown.

### Methods

#### layout 

Checks to see if the tabs all fit in one row and displays the text of an active tab in the list:
```javascript
.tabdrop('layout');
```
