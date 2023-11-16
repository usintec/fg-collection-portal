@Library('addons') _
pipeline {
    agent {
        node {
            label 'fiap-stg'
        }
    }
    options {
        skipStagesAfterUnstable()
        disableConcurrentBuilds()
    }


    stages {
        stage('Development') {
            when {
                branch 'development'
                beforeAgent true
            }
            tools {
                nodejs 'NodeJS'
            }
            stages {
                stage('Pre work') {
                    steps {
                        script {
                            setTerraform()
                        }
                        sh "terraform -version"
                    }
                }
                stage('Build For Development') {

                    steps {
                        withCredentials([file(credentialsId: 'ssh', variable: 'github_ssh'),
                        file(credentialsId: 'ssh_pub', variable: 'github_ssh_pub'),
                        ]) {
                            setupGithubSSH()
                            withAWS(region: 'eu-west-1', role: 'arn:aws:iam::240725571218:role/Jenkins') {
                                sh "chmod a+x terraform/deploy/*"
                                sh "./terraform/deploy/qa.sh"
                                sh 'npm cache clean --force'
                                sh 'rm -rf node_modules && rm ./package-lock.json'
                                sh 'npm install'
                                sh 'npm run build'
                                sh "aws s3 cp ./dist s3://portal-fg-qa-origin --recursive"
                            }
                        }
                    }
                    post {
                        always {
                            cleanWs()
                        }
                    }
                }
            }
        }
        stage('Staging') {
            when {
                branch 'staging'
                beforeAgent true
            }
            tools {
                nodejs 'NodeJS'
            }
            stages {
                // stage('Code Quality check via SonarQube') {
                //     steps {
                //         script{
                //             def scannerHome = tool 'Sonarqube';
                //             withSonarQubeEnv(credentialsId: 'Jenkins-sonar') {
                //                 sh "${scannerHome}/bin/sonar-scanner"
                //             }
                //         }
                //     }
                // }
                stage('Pre work') {
                    steps {
                        script {
                            setTerraform()
                        }
                        sh "terraform -version"
                    }
                }
                
                stage('Build For Staging') {

                    steps {
                        withCredentials([file(credentialsId: 'ssh', variable: 'github_ssh'),
                        file(credentialsId: 'ssh_pub', variable: 'github_ssh_pub'),
                        ]) {
                            setupGithubSSH()
                            withAWS(region: 'eu-west-1', role: 'arn:aws:iam::240725571218:role/Jenkins') {
                                sh "chmod a+x terraform/deploy/*"
                                sh "./terraform/deploy/qa.sh"
                                sh 'npm cache clean --force'
                                sh 'rm -rf node_modules && rm ./package-lock.json'
                                sh 'npm install'
                                sh 'npm run build'
                                sh "aws s3 cp ./dist/mocca s3://admin-mocca-qa-origin --recursive"
                            }
                        }
                    }
                    post {
                        always {
                            cleanWs()
                        }
                    }
                }
            }
        }
    }
}
