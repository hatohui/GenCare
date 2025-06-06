-- 1. Insert roles
INSERT INTO "role" (name, description) VALUES
  ('admin', 'Administrator role'),
  ('staff', 'Staff role'),
  ('consultant', 'Consultant role'),
  ('member', 'Member role'),
  ('manager', 'Manager role');

-- 2. Insert departments
INSERT INTO "department" (name, description) VALUES
  ('Cardiology', 'Heart department'),
  ('Pediatrics', 'Children department');

-- 3. Insert accounts
INSERT INTO "account" (role_id, email, password_hash, first_name, last_name, phone, date_of_birth, gender, avatar_url, created_at, is_deleted)
VALUES
  ((SELECT id FROM "role" WHERE name = 'admin'), 'admin@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Alice', 'Admin', '1234567890', '1980-01-01', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'staff'), 'staff1@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Bob', 'Staff', '0987654321', '1990-02-02', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'consultant'), 'consultant1@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Tom', 'Consultant', '1231231234', '1987-07-07', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member1@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'David', 'Member', '2233445566', '2000-04-04', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'manager'), 'manager1@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Eve', 'Manager', '5556667777', '1982-08-08', FALSE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member2@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'John', 'Doe', '1112223333', '1995-05-15', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member3@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Jane', 'Doe', '4445556666', '1993-03-20', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member4@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Alice', 'Smith', '7778889999', '1992-06-25', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member5@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Bob', 'Brown', '1112233445', '1994-09-10', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member6@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Charlie', 'Davis', '1234567891', '1996-12-05', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member7@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Diana', 'Wilson', '2233445566', '1991-07-15', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member8@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Eve', 'Moore', '2345678901', '1989-11-11', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member9@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Frank', 'Taylor', '3456789012', '1997-04-01', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member10@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Grace', 'Anderson', '4567890123', '1998-08-22', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member11@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Hank', 'Thomas', '5678901234', '1992-01-01', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member12@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Ivy', 'Jackson', '6789012345', '1990-12-10', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member13@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Jack', 'White', '7890123456', '1994-07-05', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member14@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Kathy', 'Harris', '8901234567', '1991-03-30', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member15@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Liam', 'Clark', '9012345678', '1995-02-10', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member16@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Mia', 'Lewis', '0123456789', '1992-11-22', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member17@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Noah', 'Young', '1234567890', '1993-09-09', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member18@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Olivia', 'King', '2345678901', '1988-08-23', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member19@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Peyton', 'Wright', '3456789012', '1990-01-15', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member20@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Quinn', 'Scott', '4567890123', '1995-04-18', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member21@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Ryan', 'Adams', '5678901234', '1996-10-12', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member22@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Sophie', 'Baker', '6789012345', '1994-05-28', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member23@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Tom', 'Gonzalez', '7890123456', '1992-04-16', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member24@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Uma', 'Hernandez', '8901234567', '1991-07-08', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member25@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Vera', 'Martinez', '9012345678', '1988-12-25', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member26@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Will', 'Lopez', '0123456789', '1993-05-10', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member27@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Xander', 'Perez', '1234567890', '1994-02-20', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member28@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Yara', 'Roberts', '2345678901', '1995-09-11', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member29@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Zoe', 'Walker', '3456789012', '1996-01-28', TRUE, NULL, NOW(), FALSE),
  ((SELECT id FROM "role" WHERE name = 'member'), 'member30@example.com', '$2a$11$RqiCAeS/n.czBM4uIpfxaen.0K6m/.FFclLWb1sQLcA7hJ.DgfVhe', 'Adam', 'Carter', '4567890123', '1997-06-17', TRUE, NULL, NOW(), FALSE);

--4. Insert staff_info
INSERT INTO "staff_info" (account_id, department_id, degree, year_of_experience, biography)
SELECT a.id, d.id, 'MD', 5, 'Experienced Doctor in Cardiology'
FROM "account" a, "department" d WHERE a.email = 'staff1@example.com' AND d.name = 'Cardiology'
UNION ALL
SELECT a.id, d.id, 'PhD', 3, 'Pediatric Specialist'
FROM "account" a, "department" d WHERE a.email = 'consultant1@example.com' AND d.name = 'Pediatrics';

-- -- 5. Insert slots
-- INSERT INTO "slot" (no, start_at, end_at, is_deleted) VALUES
--   (1, '2025-05-30 08:00:00', '2025-05-30 09:00:00', FALSE),
--   (2, '2025-05-30 09:00:00', '2025-05-30 10:00:00', FALSE),
--   (3, '2025-05-30 10:00:00', '2025-05-30 11:00:00', FALSE),
--   (4, '2025-05-30 11:00:00', '2025-05-30 12:00:00', FALSE);

-- -- 6. Insert schedules
-- INSERT INTO "schedule" (slot_id, account_id)
-- SELECT s.id, a.id FROM "slot" s, "account" a WHERE s.no = 1 AND a.email = 'staff1@example.com'
-- UNION ALL
-- SELECT s.id, a.id FROM "slot" s, "account" a WHERE s.no = 2 AND a.email = 'consultant1@example.com';

-- -- 7. Insert birth control
-- INSERT INTO "birth_control" (account_id, start_date, end_date, start_safe_date, end_safe_date, start_unsafe_date, end_unsafe_date)
-- SELECT id, NOW(), NOW() + INTERVAL '90 days', NOW(), NOW() + INTERVAL '40 days', NOW() + INTERVAL '41 days', NOW() + INTERVAL '89 days'
-- FROM "account" WHERE email = 'member1@example.com';

-- -- 8. Insert conversation
-- INSERT INTO "conversation" (staff_id, member_id, start_at, status)
-- SELECT
--   (SELECT id FROM "account" WHERE email = 'staff1@example.com'),
--   (SELECT id FROM "account" WHERE email = 'member1@example.com'),
--   NOW(), TRUE;

-- -- 9. Insert messages
-- INSERT INTO "message" (conversation_id, created_by, created_at, content)
-- SELECT c.id, s.id, NOW(), 'Hello, how can I help you?'
-- FROM "conversation" c, "account" s
-- WHERE c.staff_id = s.id AND s.email = 'staff1@example.com'
-- UNION ALL
-- SELECT c.id, m.id, NOW(), 'I need advice on my health.'
-- FROM "conversation" c, "account" m
-- WHERE c.member_id = m.id AND m.email = 'member1@example.com';

-- -- 10. Insert appointment
-- INSERT INTO "appointment" (member_id, staff_id, schedule_at, status, join_url, created_at)
-- SELECT
--   (SELECT id FROM "account" WHERE email = 'member1@example.com'),
--   (SELECT id FROM "account" WHERE email = 'staff1@example.com'),
--   NOW() + INTERVAL '1 day', 'booked', 'https://meeting.com/room1', NOW();

-- -- 11. Insert purchase
-- INSERT INTO "purchase" (account_id, created_at)
-- SELECT id, NOW() FROM "account" WHERE email = 'member1@example.com';

-- -- 12. Insert payment_history
-- INSERT INTO "payment_history" (purchase_id, transaction_id, created_at, amount, status, expired_at, payment_method)
-- SELECT
--   p.id, gen_random_uuid(), NOW(), 500.00, 'paid', NOW() + INTERVAL '7 days', 'momo'
-- FROM "purchase" p
-- LIMIT 1;

-- 13. Insert services
INSERT INTO "service" (name, description, price, created_at, is_deleted)
VALUES
  ('Consultation', 'General health consultation', 200.00, NOW(), FALSE),
  ('Blood Test', 'Basic blood analysis', 100.00, NOW(), FALSE),
  ('X-ray', 'Radiological examination', 150.00, NOW(), FALSE),
  ('MRI Scan', 'Magnetic resonance imaging', 500.00, NOW(), FALSE),
  ('Ultrasound', 'Ultrasound examination', 250.00, NOW(), FALSE),
  ('ECG', 'Electrocardiogram test', 120.00, NOW(), FALSE),
  ('CT Scan', 'Computed tomography scan', 350.00, NOW(), FALSE),
  ('Vaccine', 'Vaccination for various diseases', 80.00, NOW(), FALSE),
  ('Physiotherapy', 'Physical therapy for rehabilitation', 300.00, NOW(), FALSE),
  ('Dental Cleaning', 'Routine dental cleaning', 75.00, NOW(), FALSE),
  ('Eye Exam', 'Comprehensive eye examination', 50.00, NOW(), FALSE),
  ('Hearing Test', 'Audiometric examination', 90.00, NOW(), FALSE),
  ('Cholesterol Test', 'Blood cholesterol level check', 60.00, NOW(), FALSE),
  ('Blood Pressure Monitoring', 'Monitor blood pressure levels', 40.00, NOW(), FALSE),
  ('Urine Test', 'Routine urine analysis', 45.00, NOW(), FALSE),
  ('Diabetes Screening', 'Blood sugar level test', 70.00, NOW(), FALSE),
  ('Surgery Consultation', 'Pre-surgery consultation', 150.00, NOW(), FALSE),
  ('Dermatology', 'Skin health consultation', 200.00, NOW(), FALSE),
  ('Psychological Counseling', 'Mental health consultation', 250.00, NOW(), FALSE),
  ('Allergy Test', 'Test for allergies', 110.00, NOW(), FALSE),
  ('Genetic Testing', 'Genetic disorder testing', 500.00, NOW(), FALSE),
  ('Blood Donation', 'Donate blood for hospital use', 0.00, NOW(), FALSE),
  ('HIV Test', 'Test for HIV infection', 90.00, NOW(), FALSE),
  ('Pregnancy Test', 'Test to confirm pregnancy', 50.00, NOW(), FALSE),
  ('Cancer Screening', 'General cancer screening', 300.00, NOW(), FALSE),
  ('Liver Function Test', 'Test for liver health', 80.00, NOW(), FALSE),
  ('Kidney Function Test', 'Test for kidney health', 80.00, NOW(), FALSE),
  ('Mental Health Screening', 'Screening for mental health conditions', 150.00, NOW(), FALSE),
  ('Surgical Procedure', 'Minor surgical procedures', 500.00, NOW(), FALSE),
  ('Weight Loss Consultation', 'Consultation for weight management', 200.00, NOW(), FALSE),
  ('Dietary Consultation', 'Nutrition and dietary advice', 120.00, NOW(), FALSE),
  ('Smoking Cessation Counseling', 'Support for quitting smoking', 100.00, NOW(), FALSE),
  ('Pain Management Consultation', 'Consultation for pain relief therapies', 250.00, NOW(), FALSE);


-- -- 14. Insert order_detail
-- INSERT INTO "order_detail" (purchase_id, service_id, first_name, last_name, phone, date_of_birth, gender)
-- SELECT
--   (SELECT id FROM "purchase" LIMIT 1),
--   (SELECT id FROM "service" WHERE name = 'Consultation'),
--   'David', 'Member', '2233445566', '2000-04-04', TRUE;

-- -- 15. Insert result
-- INSERT INTO "result" (order_detail_id, order_date, sample_date, result_date, status, result_data, updated_at)
-- SELECT id, NOW(), NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 hours', TRUE, 'All values normal.', NOW()
-- FROM "order_detail" LIMIT 1;

-- -- 16. Insert feedback
-- INSERT INTO "feedback" (detail, rating, created_at, created_by, service_id)
-- SELECT 'Excellent service!', 5, NOW(), (SELECT id FROM "account" WHERE email = 'member1@example.com'), (SELECT id FROM "service" WHERE name = 'Consultation');

-- -- 17. Insert blog
-- INSERT INTO "blog" (title, content, author, published_at, created_at)
-- VALUES ('Health Tips', 'Eat more vegetables.', 'Alice', NOW(), NOW());

-- -- 18. Insert comment
-- INSERT INTO "comment" (content, blog_id, account_id, created_at, created_by)
-- SELECT 'Very useful tips!', b.id, a.id, NOW(), a.id
-- FROM "blog" b, "account" a
-- WHERE b.title = 'Health Tips' AND a.email = 'member1@example.com';

-- -- 19. Insert tags
-- INSERT INTO "tag" (title) VALUES ('Health'), ('Lifestyle');

-- -- 20. Insert blog_tag
-- INSERT INTO "blog_tag" (blog_id, tag_id, created_at, created_by)
-- SELECT
--   (SELECT id FROM "blog" WHERE title = 'Health Tips'),
--   (SELECT id FROM "tag" WHERE title = 'Health'),
--   NOW(),
--   (SELECT id FROM "account" WHERE email = 'admin@example.com');

-- -- 21. Insert media
-- INSERT INTO "media" (id, url, type, description, message_id, created_at, created_by)
-- VALUES
--   ('c9935b29-903c-4bca-af2a-91c29291f07d', 'https://cdn.example.com/message1.png', 'image', 'Message image 1', '53fc0b55-4c55-41e9-8362-eb30f74eb627', NOW(), (SELECT id FROM "account" WHERE email = 'staff1@example.com')),
--   ('664b2a92-11de-402f-b4bc-150dc266ae76', 'https://cdn.example.com/message2.png', 'image', 'Message image 2', 'e45b29b5-88b8-4eae-ab58-43a31ce11e9d', NOW(), (SELECT id FROM "account" WHERE email = 'member1@example.com'));

-- INSERT INTO "media" (id, url, type, description, blog_id, created_at, created_by)
-- VALUES
--   ('5077fa82-fb6c-43af-870e-1c8156fefd99', 'https://cdn.example.com/blog_cover.jpg', 'cover', 'Blog cover image', (SELECT id FROM "blog" WHERE title = 'Health Tips'), NOW(), (SELECT id FROM "account" WHERE email = 'admin@example.com'));

-- INSERT INTO "media" (id, url, type, description, service_id, created_at, created_by)
-- VALUES
--   ('d56f7e8e-269f-4a8f-a210-719919767099', 'https://cdn.example.com/service_banner.jpg', 'banner', 'Service banner image', (SELECT id FROM "service" WHERE name = 'Consultation'), NOW(), (SELECT id FROM "account" WHERE email = 'admin@example.com'));
