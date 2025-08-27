resource "aws_vpc" "vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}
data "aws_availability_zones" "available" {
}

resource "aws_subnet" "public_subnet_1a" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.pub_sub_1a_cidr
  availability_zone = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet-1a"
  }
}

resource "aws_subnet" "public_subnet_1b" {
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = var.pub_sub_1b_cidr
  availability_zone = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = true


  tags = {
    Name = "${var.project_name}-public-subnet-1b"
  }
}


# Route Table
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

# Route to Internet Gateway
resource "aws_route" "internet_access" {
  route_table_id         = aws_route_table.public_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}



# Associate Public Subnet 1a to Route Table
resource "aws_route_table_association" "public_1a" {
  subnet_id      = aws_subnet.public_subnet_1a.id
  route_table_id = aws_route_table.public_route_table.id
}

# Associate Public Subnet 1b to Route Table
resource "aws_route_table_association" "public_1b" {
  subnet_id      = aws_subnet.public_subnet_1b.id
  route_table_id = aws_route_table.public_route_table.id
}

# Private Subnet for App 1a 
resource "aws_subnet" "private_subnet_app_1a" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.priv_sub_2a_cidr
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.project_name}-private-app-subnet-1a"
  }
}

# Private Subnet for App 1b
resource "aws_subnet" "private_subnet_app_1b" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.priv_sub_2b_cidr
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.project_name}-private-app-subnet-1b"
  }
}

# Private Subnet for DB 1a
resource "aws_subnet" "private_subnet_db_1a" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.priv_sub_3a_cidr
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.project_name}-private-db-subnet-1a"
  }
}

# Private Subnet for DB 1b
resource "aws_subnet" "private_subnet_db_1b" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = var.priv_sub_3b_cidr
  availability_zone       = data.aws_availability_zones.available.names[1]
  map_public_ip_on_launch = false

  tags = {
    Name = "${var.project_name}-private-db-subnet-1b"
  }
}
