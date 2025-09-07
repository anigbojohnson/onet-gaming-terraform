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

                        terraform destroy -auto-approve

                        terraform apply -auto-approve

                        """
                        
                    }
                }
            }
        }

stage('Get EC2 Public IP, Update Ansible Inventory & Access DB credentials') {
    steps {
        script {
            // Declare ec2Ips at script level so both dirs can use it
            def ec2Ips = ""

            dir("${TF_DIR}") {
                // Capture EC2 public IP(s) from Terraform output
                
                ec2Ips = sh(
                    script: "terraform output -json web_public_ips | jq -r '.[]'",
                    returnStdout: true
                ).trim()

                if (!ec2Ips) {
                    error "No EC2 public IPs found in Terraform output!"
                }

                echo "EC2 Public IP(s): ${ec2Ips}"
            }

            dir("${ANSIBLE_DIR}") {

                def inventoryContent = "[web]\n"

                ec2Ips.split('\n').each { ip ->
                        inventoryContent += "${ip} ansible_user=ec2-user " +
                                "ansible_ssh_private_key_file=${env.WORKSPACE}/terraform/modules/key/todo-app-key " +
                                "ansible_python_interpreter=/usr/bin/python3.12\n"
                            }

                echo "Generated inventory content:\n${inventoryContent}"

                writeFile file: 'inventory/hosts.ini', text: inventoryContent


                echo "Ansible inventory updated with EC2 IP(s)."

                // Make sure vars dir exists and save db.json
                sh "terraform output -json > roles/server/vars/db.json"

                // Print hosts.ini content in Jenkins console
                sh "cat inventory/hosts.ini"
            }
        }
    }
}
stage('Run Ansible') {
            steps {
                dir("${ANSIBLE_DIR}") {


                    script {
                        sh """
                            chmod 600 ${env.WORKSPACE}/terraform/modules/key/todo-app-key
                            export ANSIBLE_LOG_PATH=${env.WORKSPACE}/${ANSIBLE_DIR}/ansible.log
                            echo "Ansible log path: \$ANSIBLE_LOG_PATH"
                            ansible-playbook -i inventory/hosts.ini playbooks/configure_client.yml -v
                        """
                        }

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

