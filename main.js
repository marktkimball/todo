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
    // $('.bottomMenu').on('click', '.right', page.deleteMultiCompleted);
    $('.todoList').on('click', 'a', page.deleteItem);
    $('.mainContent').on('click', '.checkbox', page.clickCheckBox);
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
        completed: true
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

  // deleteCompleted: function(event){
  //   event.preventDefault();
  //     $.ajax({
  //       url: page.url + "/" +$(this).closest('.strikeThrough').data('id'),
  //       method: 'DELETE',
  //       success: function(data){
  //       }
  //     });
  //   $('.todoList').html('');
  //   page.loadItems();
  // },
  //
  // deleteMultiCompleted: function(event){
  //   _.each($('.strikeThrough'), page.deleteCompleted(event));
  // },

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

  clickCheckBox: function(event){
    $(this).parent().toggleClass('strikeThrough');
    $.ajax({
      url: page.url,
      method: 'GET',
      success: function (data) {
        console.log("Loaded checkbox data");
        var itemId = $(this).closest('li').data('id');
        if(data.completed === "true"){
          var updatedItem = {
            itemText: data.itemText,
            completed: false
          };
        }else{
          var updatedItem = {
            itemText: data.itemText,
            completed: true
          };
        }
        console.log(data);
        // page.updateItem(updatedItem, itemId);
      },
      error: function (err) {
        console.log("Error: ", err)
      }
    })
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
  page.loadItems();
}

};
