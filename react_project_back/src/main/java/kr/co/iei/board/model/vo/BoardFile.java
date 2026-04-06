package kr.co.iei.board.model.vo;

import lombok.Data;

@Data
public class BoardFile {
    private int fileNo;
    private int boardNo;
    private String memberId;
    private String boardFileName;
    private String boardFilePath;
}