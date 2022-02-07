INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering'), 
  ('Legal'),
  ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Sales Lead', 90000, 1),
  ('Saleperson', 80000, 1),
  ('Lead Engineer', 120000, 2),
  ('Software Engineer',$100000, 2),
  ('Lawyer', 150000, 3),
  ('Accountant', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Brad', 'Pitt', 1, NULL),
  ('Miguel', 'Banks', 2, 1),
  ('James', 'Bond', 2, 2),
  ('Connor', 'Mcgregor', 4, NULL),
  ('Tom', 'Brady', 3, NULL),
  ('Tom', 'Holland', 4, 3);