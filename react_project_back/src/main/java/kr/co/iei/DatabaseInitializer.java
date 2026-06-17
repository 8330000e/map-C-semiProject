package kr.co.iei;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

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
        // MySQL 데이터 타입으로 변경 (NUMBER -> INT, VARCHAR2 -> VARCHAR, SYSTIMESTAMP -> NOW())
        // 주의: 대소문자 구분을 위해 테이블명을 이전 세팅에 맞춰 소문자/대문자 통일 필요 (여기선 소문자 기준 예시)
        addColumnIfNotExists("store_review_tbl", "TRADE_NO",         "INT");
        addColumnIfNotExists("store_review_tbl", "RATING",           "INT DEFAULT 5");
        addColumnIfNotExists("store_review_tbl", "SELLER_ID",        "VARCHAR(100)");
        addColumnIfNotExists("store_review_tbl", "BUYER_ID",         "VARCHAR(100)");
        addColumnIfNotExists("store_review_tbl", "MEMBER_ID",        "VARCHAR(100)");
        addColumnIfNotExists("store_review_tbl", "MEMBER_NICKNAME",  "VARCHAR(100)");
        addColumnIfNotExists("store_review_tbl", "REVIEW_CONTENT",   "VARCHAR(2000)");
        addColumnIfNotExists("store_review_tbl", "REVIEW_CONT",      "VARCHAR(2000)");
        addColumnIfNotExists("store_review_tbl", "IS_PRIVATE",       "TINYINT DEFAULT 0 NOT NULL");
        addColumnIfNotExists("store_review_tbl", "CREATED_AT",       "DATETIME DEFAULT NOW()");
        addColumnIfNotExists("store_review_tbl", "IS_DELETED",       "TINYINT DEFAULT 0 NOT NULL");
        addColumnIfNotExists("store_board_tradeinfo_tbl", "INVOICE_NUMBER", "VARCHAR(100)");
        addColumnIfNotExists("store_board_tradeinfo_tbl", "COURIER_CODE", "INT");
        addColumnIfNotExists("store_board_tradeinfo_tbl", "SHIPPING_STATUS", "INT DEFAULT 0");
    }

    private void addColumnIfNotExists(String table, String column, String definition) {
        try {
            // MySQL INFORMATION_SCHEMA 조회 방식으로 교체
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'semiproject' AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                Integer.class, table, column
            );
            
            if (count == null || count == 0) {
                // MySQL은 ALTER TABLE ADD 시 괄호()를 붙이지 않는 것이 표준 문법입니다.
                jdbcTemplate.execute(
                    "ALTER TABLE " + table + " ADD " + column + " " + definition
                );
                log.info("[DB Init] {}에 {} 컬럼 추가 완료", table, column);
            } else {
                log.debug("[DB Init] {}의 {} 컬럼 이미 존재", table, column);
                
                if (column.equals("TRADE_NO") || column.equals("SELLER_ID") || column.equals("BUYER_ID") || column.equals("RATING")) {
                    try {
                        // MySQL IS_NULLABLE 결과값('YES' 또는 'NO') 검사
                        String isNullable = jdbcTemplate.queryForObject(
                            "SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'semiproject' AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                            String.class, table, column
                        );
                        if ("NO".equals(isNullable)) {
                            // MySQL은 MODIFY 대신 MODIFY COLUMN을 사용하며 데이터 타입을 다시 명시해 주어야 합니다.
                            String typeDef = column.equals("RATING") ? "INT" : "VARCHAR(100)";
                            jdbcTemplate.execute(
                                "ALTER TABLE " + table + " MODIFY COLUMN " + column + " " + typeDef + " NULL"
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