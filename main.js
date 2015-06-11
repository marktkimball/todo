$(document).ready(function(){

  page.init();

});

var page ={

  init: function(arguments){
    page.initStyling();
    page.initEvents();
  },

  initStyling: function(arguments){
    page.loadItems();
    page.prependTemplate('itemCount', page.itemCount, $('.bottomMenu'));
  },

  initEvents: function(arguments){
    $('.toggleViews').on('click', 'a', page.toggleViewFunc);
    $('.todoList').on('click', 'span', page.deleteItem);
    $('.todoList').on('click', '.checkbox', page.clickCheckBox);
    $('.mainContent').on('keypress', '.inputArea', page.enterPress);
    $('.mainContent').on('dblclick', 'li', page.doubleClick);
    $('.mainContent').on('keypress', '.editArea', page.editEnter);
    $('.bottomMenu').on('click', '.right', page.clearCompleted);
},

  itemCount: $('.todoList').children('li').length/2 - $('.strikeThrough').length,

  url: "http://tiy-fee-rest.herokuapp.com/collections/markkimball",

  loadItems: function () {
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
        console.log("Successfully loaded data");
        page.addAllPostsToList(data);
      },
      error: function (err) {
        console.log("Error: ", err)
      }
    });
  },

  createItem: function (newItem) {
    $.ajax({
      url: page.url,
      method: 'POST',
      data: newItem,
      success: function (data) {
        page.addOneItemToList(data);
      },
      error: function (err) {
        console.log("Error occurred: ", err);
      }
    });
  },

  addItem: function (input) {
    var newItem = {
        itemText: input,
        completed: false
        }
    page.createItem(newItem);

    $('input').val("");
  },

  deleteItem: function(event){
    event.preventDefault();

    $.ajax({
      url: page.url + "/" +$(this).closest('li').data('id'),
      method: 'DELETE',
      success: function(data){
        $('.todoList').html('');
        page.loadItems();
      }
    });
  },

  updateItem: function(updatedItem, itemId) {
    $.ajax({
      url: page.url + '/' + itemId,
      method: 'PUT',
      data: updatedItem,
      success: function (data) {
        $('.todoList').html('');
        page.loadItems();

      },
      error: function (err) {}
    });
  },

  addOneItemToList: function(item){
    page.loadTemplate("newItem", item, $('.todoList'));
  },

  addAllPostsToList: function(listOfItems){
    _.each(listOfItems, page.addOneItemToList);
  },

  loadTemplate: function(tmplName, data, $target){
    var compiledTmpl = _.template(page.getTemplate(tmplName));
    $target.append(compiledTmpl(data));
  },

  prependTemplate: function(tmplName, data, $target){
    var compiledTmpl = _.template(page.getTemplate(tmplName));
    $target.prepend(compiledTmpl(data));
  },

  getTemplate: function(name){
    return templates[name];
  },

  toggleViewFunc: function(event){
    event.preventDefault();
    if($(this).text() === "All"){
      $('.todoList').children().not('.editData').addClass('activeElement');
    }else if($(this).text() === "Active"){
      $('.todoList').children().not('.editData').not('.strikeThrough').addClass('activeElement');
      $('.todoList').children().not('.editData').siblings('.strikeThrough').removeClass('activeElement');
    }else{
      $('.todoList').children().not('.editData').not('.strikeThrough').removeClass('activeElement');
      $('.todoList').children().not('.editData').siblings('.strikeThrough').addClass('activeElement');
    }
  },

  enterPress: function(event){
    if(event.keyCode === 13){
    event.preventDefault();
    page.addItem($('input[name="todoItem"]').val());
    }
  },

  doubleClick: function(event){
    event.preventDefault();
    $(this).toggleClass('activeElement');
    $(this).next().toggleClass('activeElement');
  },

  editEnter: function (event) {
    if(event.keyCode === 13){
    event.preventDefault();
    var itemId = $(this).closest('li').data('id');
    var updatedItem = {
      itemText: $(this).closest('input[name="editTodoItem"]').val()
    };
    $(this).parent().toggleClass('activeElement');
    $(this).parent().prev().toggleClass('activeElement');
    page.updateItem(updatedItem, itemId);
  };
},

  clearCompleted: function(event){
    event.preventDefault();
    var myArray = $('.todoList').find('.strikeThrough');
    $('.todoList').find('.strikeThrough').removeClass('activeElement');
    var mappedIds = _.map(myArray, function(el){
      return{
        id: el.dataset.id
      }
    });
    _.each(mappedIds, function(el){
      $.ajax({
        url: page.url + "/" +el.id,
        method: 'DELETE',
        success: function(data){
        }
      });
    });
    $('.todoList').html('');
    window.setTimeout(page.loadItems, 300);
  },


  clickCheckBox: function(event){
    event.preventDefault();

    var itemId = $(this).parent().data('id');
    console.log(itemId);

    if($(this).parent().hasClass('strikeThrough')){
      var updatedItem = {
        completed: false
      };
    } else{
      var updatedItem = {
        completed: true
      };
    };

    $(this).parent().toggleClass('strikeThrough');

    page.updateItem(updatedItem, itemId);
  }

};
