import { useEffect, useRef, useState } from "react";
import styles from "./TextEditor.module.css";

import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ImageIcon from "@mui/icons-material/Image";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LinkIcon from "@mui/icons-material/Link";
import axios from "axios";

const TextEditor = ({ data, setData, attachedFiles, setAttachedFiles }) => {
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [alignOpen, setAlignOpen] = useState(false);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [textAlign, setTextAlign] = useState("left");

  const [history, setHistory] = useState([data || ""]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  useEffect(() => {
    if (!editorRef.current) return;

    const safeData = data ?? "";
    if (editorRef.current.innerHTML !== safeData) {
      editorRef.current.innerHTML = safeData;
    }
  }, [data]);

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const keepSelection = (e) => {
    e.preventDefault();
  };

  const saveHistory = (html) => {
    const safeHtml = html ?? "";
    const current = history[historyIndex] ?? "";

    if (current === safeHtml) return;

    let nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(safeHtml);

    if (nextHistory.length > 50) {
      nextHistory = nextHistory.slice(nextHistory.length - 50);
    }

    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const exec = (command, value = null) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand(command, false, value);

    setTimeout(() => {
      if (!editorRef.current) return;
      const html = editorRef.current.innerHTML;
      setData(html);
      saveHistory(html);
    }, 0);
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;

    const html = editorRef.current.innerHTML;
    setData(html);
    saveHistory(html);
  };

  const handleUndo = () => {
    if (!canUndo || !editorRef.current) return;

    const prevIndex = historyIndex - 1;
    const prevHtml = history[prevIndex] ?? "";

    editorRef.current.innerHTML = prevHtml;
    setData(prevHtml);
    setHistoryIndex(prevIndex);
    focusEditor();
  };

  const handleRedo = () => {
    if (!canRedo || !editorRef.current) return;

    const nextIndex = historyIndex + 1;
    const nextHtml = history[nextIndex] ?? "";

    editorRef.current.innerHTML = nextHtml;
    setData(nextHtml);
    setHistoryIndex(nextIndex);
    focusEditor();
  };

  const handleFontSize = (size) => {
    exec("fontSize", size);
    setFontSizeOpen(false);
  };

  const handleAlign = (align) => {
    if (align === "left") exec("justifyLeft");
    if (align === "center") exec("justifyCenter");
    if (align === "right") exec("justifyRight");

    setTextAlign(align);
    setAlignOpen(false);
  };

  const handleTextColor = (e) => {
    exec("foreColor", e.target.value);
  };
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedFiles((prev) => [...prev, file]);

    const fileUrl = URL.createObjectURL(file);

    const linkHtml = `
    <div class="editor-file-card" contenteditable="false">
      <div class="editor-file-left">📄</div>
      <div class="editor-file-right">
        <a href="${fileUrl}" download="${file.name}" target="_blank" rel="noreferrer">${file.name}</a>
        <small>첨부파일</small>
      </div>
    </div>
    <p><br></p>
  `;

    focusEditor();
    document.execCommand("insertHTML", false, linkHtml);

    setTimeout(() => {
      if (!editorRef.current) return;
      const html = editorRef.current.innerHTML;
      setData(html);
      saveHistory(html);
    }, 0);

    e.target.value = "";
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    setAttachedFiles((prev) => [...prev, file]);
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("upfile", file);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/boards/editor/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const imageUrl = `${import.meta.env.VITE_BACKSERVER}${res.data}`;

      focusEditor();
      document.execCommand("insertImage", false, imageUrl);

      setTimeout(() => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML;
        setData(html);
        saveHistory(html);
      }, 0);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className={styles.textEditorWrap}>
      <div className={styles.editorToolbar}>
        <button
          type="button"
          className={`${styles.toolbarIconBtn} ${!canUndo ? styles.disabledBtn : ""}`}
          onMouseDown={keepSelection}
          onClick={handleUndo}
        >
          <UndoIcon sx={{ fontSize: 20 }} />
        </button>

        <button
          type="button"
          className={`${styles.toolbarIconBtn} ${!canRedo ? styles.disabledBtn : ""}`}
          onMouseDown={keepSelection}
          onClick={handleRedo}
        >
          <RedoIcon sx={{ fontSize: 20 }} />
        </button>

        <div className={styles.toolbarDivider} />

        <div className={styles.fontDropdown}>
          <button
            type="button"
            className={styles.toolbarBtn}
            onMouseDown={keepSelection}
            onClick={() => setFontSizeOpen((prev) => !prev)}
          >
            <TextFieldsIcon sx={{ fontSize: 20 }} />
            <ArrowDropDownIcon sx={{ fontSize: 16 }} />
          </button>

          {fontSizeOpen && (
            <div className={styles.fontMenu}>
              <button
                onMouseDown={keepSelection}
                onClick={() => handleFontSize(2)}
              >
                작게
              </button>
              <button
                onMouseDown={keepSelection}
                onClick={() => handleFontSize(3)}
              >
                보통
              </button>
              <button
                onMouseDown={keepSelection}
                onClick={() => handleFontSize(5)}
              >
                크게
              </button>
            </div>
          )}
        </div>

        <button
          className={styles.toolbarIconBtn}
          onMouseDown={keepSelection}
          onClick={() => exec("bold")}
        >
          <FormatBoldIcon sx={{ fontSize: 20 }} />
        </button>

        <button
          className={styles.toolbarIconBtn}
          onMouseDown={keepSelection}
          onClick={() => exec("italic")}
        >
          <FormatItalicIcon sx={{ fontSize: 20 }} />
        </button>

        <button
          className={styles.toolbarIconBtn}
          onMouseDown={keepSelection}
          onClick={() => exec("underline")}
        >
          <FormatUnderlinedIcon sx={{ fontSize: 20 }} />
        </button>

        <label className={styles.colorPickerBtn}>
          <ColorLensIcon sx={{ fontSize: 18 }} />
          <input type="color" onChange={handleTextColor} />
        </label>

        <div className={styles.toolbarDivider} />

        <div className={styles.alignDropdown}>
          <button
            className={styles.alignTrigger}
            onMouseDown={keepSelection}
            onClick={() => setAlignOpen((prev) => !prev)}
          >
            {textAlign === "left" && <FormatAlignLeftIcon />}
            {textAlign === "center" && <FormatAlignCenterIcon />}
            {textAlign === "right" && <FormatAlignRightIcon />}
            <ArrowDropDownIcon sx={{ fontSize: 16 }} />
          </button>

          {alignOpen && (
            <div className={`${styles.alignMenu} ${styles.iconOnlyMenu}`}>
              <button
                onMouseDown={keepSelection}
                onClick={() => handleAlign("left")}
              >
                <FormatAlignLeftIcon />
              </button>
              <button
                onMouseDown={keepSelection}
                onClick={() => handleAlign("center")}
              >
                <FormatAlignCenterIcon />
              </button>
              <button
                onMouseDown={keepSelection}
                onClick={() => handleAlign("right")}
              >
                <FormatAlignRightIcon />
              </button>
            </div>
          )}
        </div>

        <div className={styles.toolbarDivider} />

        <button
          className={styles.toolbarIconBtn}
          onMouseDown={keepSelection}
          onClick={handleFileButtonClick}
        >
          <LinkIcon />
        </button>

        <button
          className={styles.toolbarIconBtn}
          onMouseDown={keepSelection}
          onClick={handleImageButtonClick}
        >
          <ImageIcon />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          hidden
          onChange={handleImageChange}
        />
      </div>

      <div
        ref={editorRef}
        className={styles.boardWriteEditor}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onInput={handleEditorInput}
      />
    </div>
  );
};

export default TextEditor;
