package kr.co.iei;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 시작 시 DB 테이블 컬럼 누락 여부를 체크하고 자동으로 보완합니다.
 */
@Component
@Order(1)
public class DatabaseInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseInitializer.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        // STORE_REVIEW_TBL 누락 컬럼 자동 추가 - 모든 nullable 컬럼들 with defaults
        addColumnIfNotExists("STORE_REVIEW_TBL", "TRADE_NO",         "NUMBER");  // Nullable - no FK check
        addColumnIfNotExists("STORE_REVIEW_TBL", "RATING",           "NUMBER DEFAULT 5");
        addColumnIfNotExists("STORE_REVIEW_TBL", "SELLER_ID",        "VARCHAR2(100)");  // Nullable - no FK check
        addColumnIfNotExists("STORE_REVIEW_TBL", "BUYER_ID",         "VARCHAR2(100)");  // Nullable - no FK check
        addColumnIfNotExists("STORE_REVIEW_TBL", "MEMBER_ID",        "VARCHAR2(100)");
        addColumnIfNotExists("STORE_REVIEW_TBL", "MEMBER_NICKNAME",  "VARCHAR2(100)");
        addColumnIfNotExists("STORE_REVIEW_TBL", "REVIEW_CONTENT",   "VARCHAR2(2000)");
        addColumnIfNotExists("STORE_REVIEW_TBL", "REVIEW_CONT",      "VARCHAR2(2000)");
        addColumnIfNotExists("STORE_REVIEW_TBL", "IS_PRIVATE",       "NUMBER(1) DEFAULT 0 NOT NULL");
        addColumnIfNotExists("STORE_REVIEW_TBL", "CREATED_AT",       "TIMESTAMP DEFAULT SYSTIMESTAMP");
        addColumnIfNotExists("STORE_REVIEW_TBL", "IS_DELETED",       "NUMBER(1) DEFAULT 0 NOT NULL");
    }

    private void addColumnIfNotExists(String table, String column, String definition) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM USER_TAB_COLUMNS WHERE TABLE_NAME = ? AND COLUMN_NAME = ?",
                Integer.class, table, column
            );
            if (count == null || count == 0) {
                jdbcTemplate.execute(
                    "ALTER TABLE " + table + " ADD (" + column + " " + definition + ")"
                );
                log.info("[DB Init] {}에 {} 컬럼 추가 완료", table, column);
            } else {
                log.debug("[DB Init] {}의 {} 컬럼 이미 존재", table, column);
                // 기존 NOT NULL 컬럼을 NULL로 변경 (TRADE_NO, SELLER_ID, BUYER_ID, RATING 등)
                if (column.equals("TRADE_NO") || column.equals("SELLER_ID") || column.equals("BUYER_ID") || column.equals("RATING")) {
                    try {
                        String nullable = jdbcTemplate.queryForObject(
                            "SELECT NULLABLE FROM USER_TAB_COLUMNS WHERE TABLE_NAME = ? AND COLUMN_NAME = ?",
                            String.class, table, column
                        );
                        if ("N".equals(nullable)) {
                            jdbcTemplate.execute(
                                "ALTER TABLE " + table + " MODIFY " + column + " NULL"
                            );
                            log.info("[DB Init] {}의 {} 컬럼을 NULL로 수정", table, column);
                        }
                    } catch (Exception e) {
                        log.debug("[DB Init] {}의 {} 컬럼 NULL 수정 불가 또는 이미 NULL", table, column);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("[DB Init] {}에 {} 컬럼 추가 실패: {}", table, column, e.getMessage());
        }
    }
}
