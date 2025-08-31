pipeline {
    agent any

    parameters {
        string(name: 'WORKSPACE_NAME', defaultValue: 'dev', description: 'Terraform workspace')
    }


    environment {
        TF_DIR = 'terraform/root'   // Path to Terraform folder
        ANSIBLE_DIR = 'ansible'     // Path to Ansible folder
        AWS_REGION = 'eu-west-2'    // Your AWS region
    }

    stages {
        stage('Terraform Init & Select Workspace') {
    steps {
        dir("${TF_DIR}") {
            withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'onet-gaming-aws-credential']]) {
                sh """
                # Initialize Terraform backend first
                terraform init -reconfigure

                # Check if workspace exists; if not, create it
                terraform workspace list | grep -w ${params.WORKSPACE_NAME} || \
                terraform workspace new ${params.WORKSPACE_NAME}

                # Select the chosen workspace
                terraform workspace select ${params.WORKSPACE_NAME}

                terraform apply -auto-approve
                """
            }
        }
    }
}


        stage('Get EC2 Public IP, Update Ansible Inventory & Access DB credentials') {
            steps {
                dir("${TF_DIR}") {
                    script {
                        // Capture EC2 public IP(s) from Terraform output
                        def ec2Ips = sh(
                            script: "terraform output -json web_public_ips | jq -r '.[]'",
                            returnStdout: true
                        ).trim()

                        if (!ec2Ips) {
                            error "No EC2 public IPs found in Terraform output!"
                        }

                        echo "EC2 Public IP(s): ${ec2Ips}"

                        // Write Ansible inventory
                        dir("${ANSIBLE_DIR}") {
                            def inventoryContent = """[web]
        """
                            ec2Ips.split('\n').each { ip ->
                                inventoryContent += "${ip} ansible_user=ubuntu ansible_ssh_private_key_file=${env.HOME}/terraform/modules/key/todo-app-key\n"
                            }

                            writeFile file: 'inventory/hosts.ini', text: inventoryContent
                            echo "Ansible inventory updated with EC2 IP(s)."

                            // Export Terraform outputs for Ansible
                // Make sure vars dir exists and save db.json
                  sh "mkdir -p ${ANSIBLE_DIR}/roles/server/vars"
                  sh "terraform output -json > ${ANSIBLE_DIR}/roles/server/vars/db.json"
                  echo "Terraform outputs exported to roles/server/vars/db.json"
                        }
                    }
                }
            }
        }

        
        stage('Run Ansible') {
            steps {
                    dir("${ANSIBLE_DIR}") {
                        sh "ansible-playbook -i inventory/hosts.ini playbooks/configure_client.yml"
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
