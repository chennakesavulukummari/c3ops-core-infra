# C3OPS Core Infrastructure - Architecture Diagram

## Network Architecture Overview

```
INTERNET
    |
    |
    v
+-----------------------------+
|  Internet Gateway (IGW)     |
+-----------------------------+
    |
    |
+-----------------------------+
| PUBLIC ROUTE TABLE          |
| Route: 0.0.0.0/0 -> IGW    |
+-----------------------------+
    |
    |
+-----------------------------------------------+
|       PUBLIC SUBNETS (2)                     |
| Subnet 1: 10.0.1.0/24 (AZ-a)                |
| Subnet 2: 10.0.2.0/24 (AZ-b)                |
| Resources: ALB, Bastion Hosts, NAT GW EIPs |
+-----------------------------------------------+
    |                              |
    |                              v
    |                    +-------------------+
    |                    | NAT Gateway 1     |
    |                    | Elastic IP (AZ-a) |
    |                    +-------------------+
    |                              |
    |                              v
    |                    +-------------------+
    |                    | Private Web RT 1  |
    |                    | (AZ-a)            |
    |                    +-------------------+
    |                              |
    |                              v
    |                    +-------------------+
    |                    | Web Subnets (2)   |
    |                    | 10.0.11.0/24      |
    |                    | 10.0.12.0/24      |
    |                    +-------------------+
    |                              |
    |                              v
    |                    +-------------------+
    |                    | App Subnets (2)   |
    |                    | 10.0.21.0/24      |
    |                    | 10.0.22.0/24      |
    |                    +-------------------+
    |                              |
    |                              v
    |                    +-------------------+
    |                    | DB Subnets (2)    |
    |                    | 10.0.31.0/24      |
    |                    | 10.0.32.0/24      |
    |                    +-------------------+

SECURITY GROUPS FLOW
==================

Public SG (80, 443, 22 from 0.0.0.0/0)
    |
    v
Web SG (80, 443 from PublicSG, 22 from BastionSG)
    |
    v
App SG (80, 443, 8080 from WebSG, 22 from PublicSG)
    |
    v
DB SG (3306, 5432, 27017 from AppSG)
```

## Data Flow

### Inbound Traffic (Internet -> Private)
```
1. Internet -> Public SG (ALB)
2. ALB -> Web SG (Subnet)
3. Web -> App SG (Subnet)
4. App -> DB SG (Subnet)
```

### Outbound Traffic (Private -> Internet)
```
1. Private Subnet -> NAT Gateway
2. NAT Gateway -> IGW
3. IGW -> Internet
```

## Availability Zones Distribution

```
ap-south-2a                          ap-south-2b
+-----------+                        +-----------+
| Public SN |                        | Public SN |
| 10.0.1.0  | <---IGW---> | <---IGW---| 10.0.2.0  |
+-----------+                        +-----------+
     |                                    |
     v                                    v
 NAT GW 1 EIP                         NAT GW 2 EIP
     |                                    |
     v                                    v
+-----------+                        +-----------+
| Web SN    |                        | Web SN    |
| 10.0.11.0 |                        | 10.0.12.0 |
+-----------+                        +-----------+
     |                                    |
     v                                    v
+-----------+                        +-----------+
| App SN    |                        | App SN    |
| 10.0.21.0 |                        | 10.0.22.0 |
+-----------+                        +-----------+
     |                                    |
     v                                    v
+-----------+                        +-----------+
| DB SN     |                        | DB SN     |
| 10.0.31.0 |                        | 10.0.32.0 |
+-----------+                        +-----------+
```

## CIDR Breakdown

```
VPC: 10.0.0.0/16 (65,536 IPs)
|
├─ Public Subnets: 10.0.0.0/22 (1,024 IPs)
│  ├─ Subnet 1: 10.0.1.0/24 (256 IPs) - AZ-a
│  └─ Subnet 2: 10.0.2.0/24 (256 IPs) - AZ-b
|
├─ Private Web: 10.0.8.0/22 (1,024 IPs)
│  ├─ Subnet 1: 10.0.11.0/24 (256 IPs) - AZ-a
│  └─ Subnet 2: 10.0.12.0/24 (256 IPs) - AZ-b
|
├─ Private App: 10.0.16.0/22 (1,024 IPs)
│  ├─ Subnet 1: 10.0.21.0/24 (256 IPs) - AZ-a
│  └─ Subnet 2: 10.0.22.0/24 (256 IPs) - AZ-b
|
└─ Private DB: 10.0.24.0/22 (1,024 IPs)
   ├─ Subnet 1: 10.0.31.0/24 (256 IPs) - AZ-a
   └─ Subnet 2: 10.0.32.0/24 (256 IPs) - AZ-b
```

## Route Tables

### Public Route Table
```
Destination          Target
0.0.0.0/0           Internet Gateway
10.0.0.0/16         Local (VPC)
```

### Private Route Tables (Web & App Tiers)
```
Destination          Target
0.0.0.0/0           NAT Gateway (same AZ)
10.0.0.0/16         Local (VPC)
```

### Private DB Route Table
```
Destination          Target
10.0.0.0/16         Local (VPC) [No external route]
```

## Network ACLs Rules

### Public NACL
```
Inbound:
  Rule 100: TCP 80 (HTTP)    - 0.0.0.0/0
  Rule 110: TCP 443 (HTTPS)  - 0.0.0.0/0
  Rule 120: TCP 1024-65535   - 0.0.0.0/0 (Ephemeral)

Outbound:
  Rule 100: All protocols    - 0.0.0.0/0
```

### Private Web & App NACLs
```
Inbound:
  Rule 100: All protocols    - 10.0.0.0/16 (VPC internal)

Outbound:
  Rule 100: All protocols    - 0.0.0.0/0
```

### Private DB NACL
```
Inbound:
  Rule 100: All protocols    - 10.0.0.0/16 (VPC internal only)

Outbound:
  Rule 100: All protocols    - 10.0.0.0/16 (VPC internal only)
```

## High Availability Features

1. **Multi-AZ Deployment**
   - All tiers replicated across 2 AZs
   - Automatic failover capability

2. **NAT Gateway Redundancy**
   - One NAT GW per AZ
   - Each AZ has independent outbound path

3. **Route Table Isolation**
   - Separate route tables per tier
   - Granular traffic control

4. **Security Group Layering**
   - 4-tier security group hierarchy
   - Deny-by-default approach

## Disaster Recovery

- **Backup**: Regular snapshot of configuration
- **Restore**: Can redeploy entire infrastructure in minutes
- **State File**: Stored in encrypted S3 with DynamoDB locking
- **Documentation**: Complete IaC allows rapid reconstruction

## Scalability

- **Horizontal**: Add more instances in subnets
- **Vertical**: Modify instance types
- **Network**: Extend CIDR if needed (requires careful planning)
- **Auto Scaling**: Can add ASGs to web/app tiers

## Monitoring & Logging

1. **VPC Flow Logs**
   - Captures all network traffic
   - Stored in CloudWatch Logs
   - 7-day retention

2. **CloudWatch Alarms** (Can be added)
   - NAT Gateway metrics
   - Network ACL statistics
   - Security group violations

3. **AWS Config** (Recommended)
   - Track configuration changes
   - Compliance monitoring
   - Audit trail

---

**Architecture Version**: 1.0
**Last Updated**: April 9, 2024
**Terraform Version**: 1.9.5+
**AWS Account**: 225989338000
**Region**: ap-south-2
