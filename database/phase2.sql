CREATE TABLE IF NOT EXISTS courses (
    id INT(11) NOT NULL AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_months INT(11) NOT NULL DEFAULT 6,
    base_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS study_materials (
    id INT(11) NOT NULL AUTO_INCREMENT,
    course_id INT(11) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS video_lectures (
    id INT(11) NOT NULL AUTO_INCREMENT,
    course_id INT(11) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(255) NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Insert some default courses to get started
INSERT IGNORE INTO courses (id, course_name, description, duration_months, base_fee) VALUES 
(1, 'Tally Prime with GST', 'Complete accounting software training.', 3, 3500.00),
(2, 'ADCA', 'Advanced Diploma in Computer Applications.', 12, 12000.00),
(3, 'Web Development', 'HTML, CSS, JS, and React frontend development.', 6, 8000.00);
