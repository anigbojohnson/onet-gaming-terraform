resource "aws_eip" "eip-nat" {
  count = terraform.workspace == "prod" ? 2 : 1

  tags = {
    Name = "eip-nat-${count.index + 1}"
  }
}

# create nat gateway in public
resource "aws_nat_gateway" "nat" {
  count         = terraform.workspace == "prod" ? 2 : 1
  allocation_id = aws_eip.eip-nat[count.index].id
  subnet_id     = terraform.workspace == "prod" ? var.public_subnet_ids[count.index] : var.public_subnet_ids[0]

  tags = {
    Name = "nat-${count.index + 1}"
  }

  depends_on = [var.igw_id]
}

# create private route table Pri-RT-A and add route through NAT-GW-A
resource "aws_route_table" "private_rt" {
  count  = terraform.workspace == "prod" ? 2 : 1
  vpc_id = var.vpc_id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat[ terraform.workspace == "prod" ? count.index : 0].id
  }

  tags = {
    Name = "private-rt-${count.index + 1}"
  }
}


resource "aws_route_table_association" "private_association" {
  count     = length(var.private_subnet_ids)
  subnet_id = var.private_subnet_ids[count.index]

  route_table_id = aws_route_table.private_rt[
    terraform.workspace == "prod" ? count.index % 2 : 0
  ].id
}


