'use strict';


define(function (require, exports, module) {


    var CommandManager = brackets.getModule('command/CommandManager');
    var Menus          = brackets.getModule('command/Menus');
    var Menu           = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU); // меню "Правка"
    var ContextMenu    = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
    var KeyManager     = brackets.getModule('command/KeyBindingManager');


    var COMMAND_ID = 'classextractor.convert';
    CommandManager.register('Class Extractor', COMMAND_ID, getSelectText);

    Menu.addMenuItem(COMMAND_ID);
    KeyManager.addBinding(COMMAND_ID, 'Ctrl-Alt-D'); // Ctrl автоматически заменяется на CMD для Mac
    ContextMenu.addMenuItem(COMMAND_ID);
});



function getSelectText() {

        if (window.getSelection) {
            var range = window.getSelection ();       
            extractClasses(range);
        }
}


function extractClasses(range) {

            range = range.toString().split(/=\s*"|"/);

            var newArray = [];

            range.map(function (item, index) {
                if(item.includes("class")){
                    newArray.push(range[index + 1]);
                }
            });

            if(newArray.length > 0){
                newArray = newArray.toString().split(/,|\s/);
                deleteRepeatClass(newArray);
            }
        }

function deleteRepeatClass(newArray) {

               var uniqueArray = newArray.filter(function(item, pos) {
                    return newArray.indexOf(item) == pos;
                });

            modifyClassList(uniqueArray);
    }


function modifyClassList(uniqueArray) {

            var classList = [];

                uniqueArray.forEach(function (element){
                    if(element){
                    classList +='.'+element+' { \n\n } \n';
                    }
                });

                  writeClipBoard(classList);
    }


function writeClipBoard(classList) {
        var input = document.createElement('textarea');
        input.innerHTML = classList;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
}
