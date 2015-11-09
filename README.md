ShowHide.js
===
The ShowHide.js module can be used to show and hide detail information when the user clicks on a trigger element.

The module was build to support two common patterns:

1. Having the trigger inside the detail container. A good example of this is a FAQ item which can be opened/closed by clicking on the item itself.
2. Having the trigger outside of the detail container, it can pretty much be anywhere on the page. This is something you may encounter when there is button to show/hide a navigation menu on smaller screen sizes.

Browser compatibility
---
This module is compatible with Internet Explorer 9 and above. It is possible to use it on Internet Explorer 8 when you use polyfills for the following:

- addEventListener and removeEventListener
- classList
- Node.textContent

Requirements
---
### HTML
To use this module, the following requirements will have to be met:

- There has to be an element with the attribute `data-sh-trigger` with a value that uniquely identifies that element as a trigger for a detail view. When the visitor clicks on this element it will toggle the visibility of the detail view.
- There has to be an element with the attribute `data-sh-container` with the same value as the trigger element. This is the element which will be manipulated by the module, it's `max-height` property will be changed to show/hide the detail view. It is recommended to give this element the style `overflow: hidden` or else the content of the content container will remain visible when the element detail view is closed.
- There has to be an element with the attribute `data-sh-content` with the same value as the trigger element. This should be a direct descendant of the container element. Whatever content that should be shown / hidden should be placed inside this element.

This would be a fairly typical way to set it up:
```html
<button data-sh-trigger="detailA">Show details</button>
<div data-sh-container="detailA">
	<div data-sh-content="detailA">
		<p>
			This is the content to be shown/hidden
		</p>
	</div>
</div>
```

### CSS
The module uses three CSS classes, you will have to provide these yourself. The classnames can be configured when creating an instance of the module.
<dl>
	<dt>closed<dt>
	<dd>This class is applied to the container element when the detail view is hidden from view and is removed when the detail view is visible. The height of the container will be set via JavaScript so you don't have to do this in CSS.</dd>
	<dt>opened</dt>
	<dd>This class is applied to the container element when the detail view is visible and is removed when the detail view is hidden from view.</dd>
	<dt>transition</dt>
	<dd>This class is applied to animate the change in height of the container element. It should at least transform the <code>max-height</code> property.</dd>
</dl>


Public methods
---
The following methods are available:

### `constructor(overrides)`
When creating an instance of ShowHide.js through `new ShowHide()` it is possible to pass along overrides for the default module configuration options. The constructor expects an object, only properties matching the default options will be used.
- - -

### `hideDetailView(id, skipTransition)`
Manual method to hide the detail view. It requires the ID to find the detail view and it is possible to tell it to skip the transition by setting the `skipTransition` parameter to `true`.
- - -

### `init(onInitCallback, context)`
This method needs to be called to initialize the module, the module will not be active until this is done. The initialization will iterate over all elements with the attribute `[data-sh-trigger="<id>"]` and tries to get the matching elements with the attributes `[data-sh-container="<id>"]` and `[data-sh-content="<id>"]`.

When the matching elements have been found the module will check if the initial state of the detail view should be visible or not and intializes the detail view accordingly. It will also attach a click handler to the trigger element so it can detect if the state of the detail view should be toggled.

After the above steps have been completed it will call the `onInitCallback` method if one was specified. The callback method will receive an object with a property named `id`, its value matching the value from the `[data-sh-trigger]` attribute of the trigger element. The callback is executed on the specified `context` element.
- - -

### `replaceTrigger(id, newElement)`
It is possible to replace the trigger element with another element. This could be convenient when you have a anchor element to do something but want to replace it with a button when JavaScript is available. The new trigger element needs to have the `[data-sh-trigger="<id>"]` attribute like the original trigger.

The `id` parameter will be used to find the original trigger element. Its click handler will be removed and the element will be replaced with the element passed along in the `newElement` parameter. The new trigger will be given the click handler so the module can detect if the state of the detail view should be toggled.
- - -

### `showDetailView(id, skipTransition)`
Manual method to show the detail view. It requires the ID to find the detail view and it is possible to tell it to skip the transition by setting the `skipTransition` parameter to `true`.

Configuration
---
The following configuration options are available for the module:
<dl>
	<dt><code>attrContent</code> (default: <code>data-sh-content</code>)</dt>
	<dd>The name of the attribute which identifies the element with the content.</dd>
	<dt><code>attrContainer</code> (default: <code>data-sh-container</code>)</dt>
	<dd>The name of the attribute which identifies the element that acts as a container to the content element.</dd>
	<dt><code>attrOpenOnInit</code> (default: <code>data-sh-open</code>)</dt>
	<dd>The name of the attribute which marks the detail view as being open by default.</dd>
	<dt><code>attrTrigger</code> (default: <code>data-sh-trigger</code>)</dt>
	<dd>The name of the attribute which identifies the element that acts as a trigger to show/hide the detail view.</dd>
	<dt><code>cssClosed</code> (default: <code>closed</code>)</dt>
	<dd>The name of the CSS class which is applied to the container element when the detail view is hidden.</dd>
	<dt><code>cssOpened</code> (default: <code>opened</code>)</dt>
	<dd>The name of the CSS class which is applied to the container element whe the detail view is visible.</dd>
	<dt><code>cssTransition</code> (default: <code>transition</code>)</dt>
	<dd>The name of the CSS class which is applied to enable the transition when manipulating the `max-height` property of the container element.</dd>
</dl>

Note on calculating the collapsed height
---
When the detail view is hidden from view the module tries to calculate the collapsed height of the container. When the `box-sizing` of the container is set to `border-box`, the module will add the width of the top and bottom border to the calculated collapsed height of the container.

In case the trigger is placed inside the container a little extra work is done to determine the collapsed height of the container. It will traverse the trigger's ancestors until it finds the element that is a direct descendant of the container (this can be the trigger element itself). Once the direct descendant is found the module checks if it positioned absolutely, if it is nothing else is done. If the direct descendant is not positioned absolutely its `offsetHeight` and bottom and top margin are added to the collapsed height of the container element.

Changelog
---
2015-11-09 / version 1.3:
- Made two more attribute names configurable through the options object. You can
  now specify the names for the attribute containing the trigger text when the
  detail view is hidden and the attribute containing the trigger text when the
  detail view is shown.

2015-08-21 / version 1.2:
- Added support for the `aria-expanded` attribute on the trigger element
- Added support for the `aria-hidden` attribute on the content element
- Added support for the 'aria-controls' attribute on the trigger element
- Changed the click handler of the trigger element to use currentTarget instead
  of target. This will properly handle triggers which have child elements that
  could trigger the click event

2014-10-14 / version 1.1:
- Fixed a bug on OSX Safari; An unwanted additional transition was visible after showing the detail view

2014-10-01 / version 1.0.1:
- Clean up of the Grunt tasks
- Updated the linter rules
- Fixed linter issues

2014-09-30 / version 1.0  :
- Initial public release
