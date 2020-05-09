

$("textarea").keydown(function (e) {
    if (e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        end = this.selectionEnd;

        var $this = $(this);

        // set textarea value to: text before caret + tab + text after caret
        $this.val($this.val().substring(0, start)
            + "\t"
            + $this.val().substring(end));

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        return false;
    }
});

var editor = null;

function SetupEditor(obj) {
    editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/pascal");
    editor.session.on('change', function (delta) {
        obj.invokeMethodAsync("EditorChanged", editor.getValue());
    });

    obj.invokeMethodAsync("EditorChanged", editor.getValue());
}

function setEditorValue(str) {
    if (editor == null)
        return;
    editor.setValue(str);
}


