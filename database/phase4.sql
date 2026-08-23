ALTER TABLE admin ADD COLUMN role ENUM('admin', 'receptionist', 'instructor') NOT NULL DEFAULT 'admin';
