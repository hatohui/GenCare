-- 1. role
INSERT INTO "role" (name, description) VALUES
  ('admin', 'Administrator role'),
  ('staff', 'Staff role'),
  ('consultant', 'Consultant role'),
  ('member', 'Member role'),
  ('manager', 'Manager role');
 
-- Các phần insert khác giữ nguyên.
-- 2. department
INSERT INTO "department" (name, description) VALUES
  ('Cardiology', 'Heart department'),
  ('Pediatrics', 'Children department');
-- 3. account
-- Lưu ý: cần insert role_id là UUID tham chiếu đến bảng role đã được sinh ra ở bước trên, có thể dùng subquery hoặc lấy id theo thứ tự.
INSERT INTO "account" (role_id, email, password_hash, first_name, last_name, phone, date_of_birth, gender, avatar_url, created_at, is_deleted)
VALUES
  ((SELECT id FROM "role" WHERE name = 'admin'), 'admin@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Alice', 'Admin', '1234567890', '1980-01-01', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'staff'), 'staff1@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Bob', 'Staff', '0987654321', '1990-02-02', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'consultant'), 'consultant1@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Tom', 'Consultant', '1231231234', '1987-07-07', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member1@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'David', 'Member', '2233445566', '2000-04-04', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'manager'), 'manager1@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Eve', 'Manager', '5556667777', '1982-08-08', FALSE, NULL, NOW(), FALSE);


-- -- 4. refresh_token
-- INSERT INTO "refresh_token" (account_id, token, is_revoked, last_used_at, expires_at)
-- SELECT id, 'token_admin', FALSE, NOW(), NOW() + INTERVAL '30 days' FROM "account" WHERE email = 'admin@example.com'
-- UNION ALL
-- SELECT id, 'token_member1', FALSE, NOW(), NOW() + INTERVAL '30 days' FROM "account" WHERE email = 'member1@example.com';
-- -- 5. staff_info
-- INSERT INTO "staff_info" (account_id, department_id, degree, year_of_experience, biography)
-- SELECT a.id, d.id, 'MD', 5, 'Experienced Doctor in Cardiology'
-- FROM "account" a, "department" d WHERE a.email = 'staff1@example.com' AND d.name = 'Cardiology'
-- UNION ALL
-- SELECT a.id, d.id, 'PhD', 3, 'Pediatric Specialist'
-- FROM "account" a, "department" d WHERE a.email = 'staff2@example.com' AND d.name = 'Pediatrics';

-- -- 6. slot

-- INSERT INTO "slot" (no, start_at, end_at, is_deleted) VALUES
  
--   (1, '2025-05-30 08:00:00', '2025-05-30 09:00:00', FALSE)
--   (2, '2025-05-30 09:00:00', '2025-05-30 10:00:00', FALSE)
--   (3, '2025-05-30 10:00:00', '2025-05-30 11:00:00', FALSE)
--   (4, '2025-05-30 11:00:00', '2025-05-30 12:00:00', FALSE);

-- -- 7. schedule
-- INSERT INTO "schedule" (slot_id, account_id)
-- SELECT s.id, a.id FROM "slot" s, "account" a WHERE s.no = 1 AND a.email = 'staff1@example.com'
-- UNION ALL
-- SELECT s.id, a.id FROM "slot" s, "account" a WHERE s.no = 2 AND a.email = 'staff2@example.com';

-- -- 8. birth_control
-- INSERT INTO "birth_control" (account_id, start_date, end_date, start_safe_date, end_safe_date, start_unsafe_date, end_unsafe_date)
-- SELECT id, NOW(), NOW() + INTERVAL '90 days', NOW(), NOW() + INTERVAL '40 days', NOW() + INTERVAL '41 days', NOW() + INTERVAL '89 days'
-- FROM "account" WHERE email = 'member1@example.com';
-- Select * FROM "birth_control"
-- -- 9. conversation
-- INSERT INTO "conversation" (staff_id, member_id, start_at, status)
-- SELECT 
--   (SELECT id FROM "account" WHERE email = 'staff1@example.com'),
--   (SELECT id FROM "account" WHERE email = 'member1@example.com'),
--   NOW(), TRUE;

-- -- 10. message
-- INSERT INTO "message" (conversation_id, created_by, created_at, content)
-- SELECT c.id, s.id, NOW(), 'Hello, how can I help you?'
-- FROM "conversation" c, "account" s 
-- WHERE c.staff_id = s.id AND s.email = 'staff1@example.com'
-- UNION ALL
-- SELECT c.id, m.id, NOW(), 'I need advice on my health.'
-- FROM "conversation" c, "account" m 
-- WHERE c.member_id = m.id AND m.email = 'member1@example.com';

-- -- 11. appointment
-- INSERT INTO "appointment" (member_id, staff_id, schedule_at, status, join_url, created_at)
-- SELECT 
--   (SELECT id FROM "account" WHERE email = 'member1@example.com'),
--   (SELECT id FROM "account" WHERE email = 'staff1@example.com'),
--   NOW() + INTERVAL '1 day', 'booked', 'https://meeting.com/room1', NOW();

-- -- 12. purchase
-- INSERT INTO "purchase" (account_id, created_at)
-- SELECT id, NOW() FROM "account" WHERE email = 'member1@example.com';

-- -- 13. payment_history
-- INSERT INTO "payment_history" (purchase_id, transaction_id, created_at, amount, status, expired_at, payment_method)
-- SELECT 
--   p.id, gen_random_uuid(), NOW(), 500.00, 'paid', NOW() + INTERVAL '7 days', 'momo'
-- FROM "purchase" p
-- LIMIT 1;

-- -- 14. service
-- INSERT INTO "service" (name, description, price, created_at, is_deleted)
-- VALUES
--   ('Consultation', 'General health consultation', 200.00, NOW(), FALSE),
--   ('Blood Test', 'Basic blood analysis', 100.00, NOW(), FALSE);

-- -- 15. order_detail
-- INSERT INTO "order_detail" (purchase_id, service_id, first_name, last_name, phone, date_of_birth, gender)
-- SELECT 
--   (SELECT id FROM "purchase" LIMIT 1),
--   (SELECT id FROM "service" WHERE name = 'Consultation'),
--   'David', 'Member', '2233445566', '2000-04-04', TRUE;

-- -- 16. result
-- INSERT INTO "result" (order_detail_id, order_date, sample_date, result_date, status, result_data, updated_at)
-- SELECT id, NOW(), NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 hours', TRUE, 'All values normal.', NOW()
-- FROM "order_detail" LIMIT 1;

-- -- 17. feedback
-- INSERT INTO "feedback" (detail, rating, created_at, created_by, service_id)
-- SELECT 'Excellent service!', 5, NOW(), (SELECT id FROM "account" WHERE email = 'member1@example.com'), (SELECT id FROM "service" WHERE name = 'Consultation');

-- -- 18. blog
-- INSERT INTO "blog" (title, content, author, published_at, created_at)
-- VALUES
--   ('Health Tips', 'Eat more vegetables.', 'Alice', NOW(), NOW());

-- -- 19. comment
-- INSERT INTO "comment" (content, blog_id, account_id, created_at, created_by)
-- SELECT 'Very useful tips!', b.id, a.id, NOW(), a.id
-- FROM "blog" b, "account" a
-- WHERE b.title = 'Health Tips' AND a.email = 'member1@example.com';

-- -- 20. tag
-- INSERT INTO "tag" (title)
-- VALUES
--   ('Health'),
--   ('Lifestyle');

-- -- 21. blog_tag
-- INSERT INTO "blog_tag" (blog_id, tag_id, created_at, created_by)
-- SELECT 
--   (SELECT id FROM "blog" WHERE title = 'Health Tips'),
--   (SELECT id FROM "tag" WHERE title = 'Health'),
--   NOW(),
--   (SELECT id FROM "account" WHERE email = 'admin@example.com');