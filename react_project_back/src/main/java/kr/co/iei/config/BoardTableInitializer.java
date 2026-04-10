package kr.co.iei.config;

import jakarta.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class BoardTableInitializer {
    private static final Logger logger = LoggerFactory.getLogger(BoardTableInitializer.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initBoardTable() {
        // 애플리케이션 시작 시 BOARD_TBL에 UPDATED_AT 컬럼이 있는지 확인함.
        // 이 컬럼이 없으면 게시글 수정 시간을 저장할 수 없어서,
        // 필요한 경우 자동으로 컬럼을 만들어주는 안전장치임.
        try {
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM ALL_TAB_COLUMNS WHERE OWNER = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                    Integer.class,
                    "TEAM1_DB", "BOARD_TBL", "UPDATED_AT");

            if (count == null || count == 0) {
                logger.info("UPDATED_AT column missing in BOARD_TBL, creating column.");
                jdbcTemplate.execute("ALTER TABLE BOARD_TBL ADD (UPDATED_AT DATE)");
                logger.info("UPDATED_AT column created successfully.");
            } else {
                logger.debug("UPDATED_AT column already exists in BOARD_TBL.");
            }
        } catch (Exception e) {
            // DB 권한이 없어서 컬럼을 못 만들면 여기서 경고 로그를 남기고 계속 진행함.
            // 실제 운영 환경에서는 DBA와 상의해서 컬럼을 미리 만들어 두는 것이 좋음.
            logger.warn("Failed to verify or create UPDATED_AT column in BOARD_TBL.", e);
        }
    }
}
