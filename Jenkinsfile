// Jenkinsfile
pipeline {
    agent any   // Ejecutar en cualquier agente disponible

    stages {
        stage('Build') {
            steps {
                echo 'Construyendo la imagen Docker...'
                // Construimos la imagen de la app
                sh 'docker build -t app-alquiler-vestidos .'
            }
        }

        stage('Test') {
            steps {
                echo 'Probando la imagen Docker...'
                // Ejecutamos un contenedor para verificar que la imagen se ejecuta
                // --rm = borra el contenedor después de que termina
                sh 'docker run --rm app-alquiler-vestidos echo "El contenedor se ejecutó correctamente"'
            }
        }
    }
}
