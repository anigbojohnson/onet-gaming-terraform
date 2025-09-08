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
                        # Initialize Terraform backend
                        terraform init -reconfigure

                        # Check if workspace exists; if not, create it
                        terraform workspace list | grep -w ${params.WORKSPACE_NAME} || terraform workspace new ${params.WORKSPACE_NAME}

                        # Select the chosen workspace
                        terraform workspace select ${params.WORKSPACE_NAME}

                        # Destroy resources (optional)
                        # terraform destroy -auto-approve

                        # Create resources
                        terraform apply -auto-approve
                        """
                    }
                }
            }
        }

        stage('Get EC2 Public IPs, Update Ansible Inventory & Access DB credentials') {
            steps {
                script {
                    // Fetch EC2 public and private IPs from Terraform
                    def ec2PublicIps = sh(script: "terraform output -json web_public_ips | jq -r '.[]'", returnStdout: true).trim()
                    def appPrivateIps = sh(script: "terraform output -json app_private_ips | jq -r '.[]'", returnStdout: true).trim()

                    dir("${ANSIBLE_DIR}") {
                        def publicList = ec2PublicIps.split('\n')
                        def privateList = appPrivateIps.split('\n')
                        def bastionIp = publicList[0] // Use first public IP as bastion

                        def inventoryContent = "[bastion]\n"
                        inventoryContent += "${bastionIp} ansible_user=ubuntu " +
                                            "ansible_ssh_private_key_file=${env.WORKSPACE}/terraform/modules/key/todo-app-key " +
                                            "ansible_python_interpreter=/usr/bin/python3\n\n"

                        inventoryContent += "[web]\n"
                        publicList.each { ip ->
                            inventoryContent += "${ip} ansible_user=ubuntu " +
                                                "ansible_ssh_private_key_file=${env.WORKSPACE}/terraform/modules/key/todo-app-key " +
                                                "ansible_python_interpreter=/usr/bin/python3\n"
                        }
                        inventoryContent += "\n"

                        inventoryContent += "[app]\n"
                        privateList.each { ip ->
                            inventoryContent += "${ip} ansible_user=ubuntu " +
                                                "ansible_ssh_private_key_file=${env.WORKSPACE}/terraform/modules/key/todo-app-key " +
                                                "ansible_python_interpreter=/usr/bin/python3 " +
                                                "ansible_ssh_common_args='-o ProxyJump=ubuntu@${bastionIp}'\n"
                        }

                        writeFile file: 'inventory/hosts.ini', text: inventoryContent
                        echo "Generated inventory with [bastion], [web], and [app] groups."
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
                            # Ensure private key permissions
                            chmod 600 ${env.WORKSPACE}/terraform/modules/key/todo-app-key

                            # Set Ansible log path
                            export ANSIBLE_LOG_PATH=${env.WORKSPACE}/${ANSIBLE_DIR}/ansible.log
                            echo "Ansible log path: \$ANSIBLE_LOG_PATH"

                            # Run playbook for web servers
                            ansible-playbook -i inventory/hosts.ini playbooks/configure_web.yml -v

                          
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
