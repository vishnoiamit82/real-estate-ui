import React, { useState } from 'react';
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

const theme = {
    paragraph: "editor-paragraph",
};

const EmailEditor = ({ value, onChange }) => {
    const editorState = value
        ? JSON.parse(value) // ✅ Parse valid JSON
        : { "root": { "children": [], "direction": "ltr", "format": "", "indent": 0, "type": "root", "version": 1 } }; // ✅ Default state

    return (
        <LexicalComposer initialEditorState={editorState}>
            <RichTextPlugin />
        </LexicalComposer>
    );
};

export default EmailEditor;
