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


        stage('Get EC2 IPs, Update Ansible Inventory & DB Credentials') {
            steps {
                script {
                     def ec2PublicIps = ""
                     def appPrivateIps =  ""
                     def dbVars = ""
                    // Fetch Terraform outputs
                    dir("${TF_DIR}") {
                        def tfOutputs = sh(script: "terraform output -json", returnStdout: true).trim()

                            appPrivateIps = json["app_private_ips"].value
                            ec2PublicIps  = json["web_public_ips"].value
                            dbVars = """{
                                            "db_host": "${json["db_endpoint"].value}",
                                            "db_user": "${json["db_username"].value}",
                                            "db_password": "${json["db_password"].value}",
                                            "db_name": "${json["db_name"].value}"
                                            }"""
                                        }

                    // Write DB credentials to Ansible vars
                    dir("${ANSIBLE_DIR}/roles/app/vars") {
                        writeFile file: 'db.json', text: dbVars
                        echo "DB credentials saved to db.json"
                    }

                    // Generate Ansible inventory
                    dir("${ANSIBLE_DIR}") {

                        def inventory = new StringBuilder()
                        
                        // Bastion host
                        inventory.append("[bastion]\n")
                        inventory.append("${ec2PublicIps[0]} ansible_user=ubuntu ansible_ssh_private_key_file=${env.WORKSPACE}/terraform/modules/key/todo-app-key ansible_python_interpreter=/usr/bin/python3\n\n")

                        // Web servers
                        inventory.append("[web]\n")
                        ec2PublicIps.each { ip ->
                            inventory.append("${ip} ansible_user=ubuntu ansible_ssh_private_key_file=${env.WORKSPACE}/terraform/modules/key/todo-app-key ansible_python_interpreter=/usr/bin/python3\n")
                        }
                        inventory.append("\n")

                        // App servers via bastion
                        inventory.append("[app]\n")
                        privateList.each { ip ->
                            inventory.append("${ip} ansible_user=ubuntu ansible_ssh_private_key_file=${env.WORKSPACE}/terraform/modules/key/todo-app-key ansible_python_interpreter=/usr/bin/python3 ansible_ssh_common_args='-o ProxyJump=ubuntu@${bastionIp}'\n")
                        }

                        writeFile file: 'inventory/hosts.ini', text: inventory.toString()
                        echo "Generated Ansible inventory with [bastion], [web], and [app] groups."
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
                            ansible-playbook -i inventory/hosts.ini playbooks/configure_app.yml -v


                          
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

