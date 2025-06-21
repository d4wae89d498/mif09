
; Construction de l'opérateur de point fixe de Turing pour éval. stricte 
(define Z (lambda (z) (lambda (x) (x (lambda (gel) ((z z) x))))))
(define fix
  (lambda (builder)
    ((Z Z)
     (lambda (self)
       (builder (lambda (arg) ((self "deg") arg)))))))

;; Exemple : factorial
(define fact
  (fix (lambda (fact)
        (lambda (n)
          (if (zero? n)
              1
              (* n (fact (sub1 n))))))))

;; Tests
(display (fact 0))  ; 1
(newline)

(display (fact 5))  ; 120
(newline)

(display (fact 10)) ; 3628800
(newline)
