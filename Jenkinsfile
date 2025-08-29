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


                # Apply Terraform (with remote backend) 
                terraform apply -auto-approve
                """
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
            steps {
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
