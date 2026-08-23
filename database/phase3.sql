CREATE TABLE IF NOT EXISTS exams (
    id INT(11) NOT NULL AUTO_INCREMENT,
    course_id INT(11) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT(11) NOT NULL DEFAULT 30,
    total_marks INT(11) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS exam_questions (
    id INT(11) NOT NULL AUTO_INCREMENT,
    exam_id INT(11) NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL, -- 'A', 'B', 'C', or 'D'
    marks INT(11) NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS exam_results (
    id INT(11) NOT NULL AUTO_INCREMENT,
    exam_id INT(11) NOT NULL,
    student_id INT(11) NOT NULL,
    score INT(11) NOT NULL DEFAULT 0,
    passed TINYINT(1) NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attempt (exam_id, student_id) -- Prevent retaking the exact same exam
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
