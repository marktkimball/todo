var templates = {};

templates.newItem = [
  "<% if(completed === 'true') { %><li data-id='<%= _id %>' class='activeElement strikeThrough'><input class='checkbox' type='checkbox' checked> <% } else { %><li data-id='<%= _id %>' class='activeElement'><input class='checkbox' type='checkbox'><% } %><%= itemText %><span><a href='#'>delete</a></span></li>",
  "<li class ='editData' data-id='<%= _id %>'><input class='editArea' type='text' name='editTodoItem' value='<%= itemText %>' /></li>"
].join("");

templates.itemCount = [
  "<span class='left'><%= page.itemCount %> items left</span>"
].join("");
