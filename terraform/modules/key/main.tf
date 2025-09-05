resource "aws_key_pair" "client_key" {
    key_name = "todo-app-key"
    public_key = file("terraform/modules/key/todo-app-key.pub")
}