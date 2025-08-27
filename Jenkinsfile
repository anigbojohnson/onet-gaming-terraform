pipeline {
    agent any

    // Jenkins parameter for selecting workspace
    parameters {
        choice(
            name: 'TF_WORKSPACE',
            choices: ['dev', 'prod'],
            description: 'Select Terraform workspace'
        )
    }

    environment {
        TF_DIR = 'terraform/root'                 // Path to Terraform folder
        ANSIBLE_DIR = 'ansible'             // Path to Ansible folder
        AWS_REGION = 'eu-west-2'            // Your AWS region
    }

    stages {
        stage('Terraform Deploy') {
                steps {
                    // Inject AWS credentials into environment
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'onet-gaming-aws-credential']]) {
                        dir("${TF_DIR}") {
                            sh """
                            # Check if workspace exists; if not, create it
                            terraform workspace list | grep -w ${params.TF_WORKSPACE} || \
                            terraform workspace new ${params.TF_WORKSPACE}

                            # Select the chosen workspace
                            terraform workspace select ${params.TF_WORKSPACE}

                            # Initialize Terraform
                            terraform init

                            # Apply Terraform (with remote backend)
                            terraform apply -auto-approve
                            """
                            echo "Terraform applied in workspace: ${params.TF_WORKSPACE}"
                        }
                    }
                }
            }


        stage('Get EC2 Public IP & Update Ansible Inventory') {
            steps {
                dir("${TF_DIR}") {
                    script {
                        // Capture EC2 public IP(s) from Terraform output
                        def ec2_ips = sh(
                            script: "terraform output -json web_public_ips | jq -r '.[]'",
                            returnStdout: true
                        ).trim()

                        echo "EC2 Public IP(s): ${ec2_ips}"

                        // Now directly write inventory (no need for env variable)
                        dir("${ANSIBLE_DIR}") {
                            def inventoryContent = "[web_public_ips]\n"
                            ec2_ips.split("\n").each { ip ->
                                inventoryContent += "${ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/mykey.pem\n"
                            }

                            writeFile file: 'inventory/host.ini', text: inventoryContent
                            echo "Ansible inventory updated with EC2 IP(s): ${ec2_ips}"
                        }
                    }
                }
            }
        }

        stage('Run Ansible') {
            sshagent(['onet-gaming-project-ec2']) {  // Use the credential ID from Jenkins
            dir("${ANSIBLE_DIR}") {
                sh "ansible-playbook -i inventory/dev.ini playbooks/configure_ec2.yml"
            }
    }
}


    }

    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Terraform and Ansible deployment succeeded!"
        }
        failure {
            echo "Pipeline failed. Check logs."
        }
    }
}
