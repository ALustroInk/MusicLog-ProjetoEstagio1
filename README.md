![MusicLog Banner](./public/assets/imgs/MusicLog_banner.png)

---

# MusicLog
 
> Aplicação web para registrar, organizar e acessar uma coleção de músicas pessoal.
 
![Status](https://img.shields.io/badge/Status:-Concluído-green?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Node.js%20%7C%20Express%20%7C%20MySQL-black?style=flat-square)
 
---
 
## Sobre o projeto
 
O MusicLog é uma aplicação web utilizada como base para um desafio de infraestrutura em nuvem, desenvolvido durante meu período de estágio.

O objetivo foi provisionar uma arquitetura na Amazon Web Services (AWS), realizar o deploy da aplicação e compreender o funcionamento de cada serviço, desde a hospedagem até a segurança e o monitoramento.

Ao final, a arquitetura e as decisões técnicas foram apresentadas à equipe, consolidando os conhecimentos adquiridos durante o desafio.  
  
## Arquitetura AWS

O ambiente foi estruturado para integrar a aplicação web aos serviços de infraestrutura da AWS, priorizando organização, segurança e monitoramento.

![Diagrama de Arquitetura](./public/assets/imgs/MusicLog_diagrama.png)

---


## Componentes da infraestrutura
 
| Serviço/Tecnologia | Responsabilidade |
|------------|----------|
| Amazon EC2 | Hospedagem da aplicação|
| Amazon RDS (MySQL) | Persistência dos dados|
| Amazon S3 | Armazenamento das capas musicais|
| IAM Role | Acesso seguro da EC2 ao S3, sem Access Keys no código|
| Docker | Containerização da aplicação|
| Nginx | Proxy reverso para a aplicação|
| DuckDNS | Domínio para acesso ao projeto|
| Amazon CloudWatch | Monitoramento de CPU, memória, disco e armazenamento do RDS|
| VPC e Subnets | Organização e isolamento da infraestrutura|
| Security Groups | Controle de tráfego e acesso aos recursos|

---

 
## </> | Linguagens e Tecnologias (Stack)
 
| Camada | Tecnologia | Descrição |
|--------|------------|----------|
| Frontend | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | HTML para o corpo do site, CSS para o design e Javascript para as funcionalidades|
| Backend | ![Node.js](https://img.shields.io/badge/Node.js-538310?style=flat&logo=node.js&logoColor=white) + ![Express](https://img.shields.io/badge/Express.js-549212?style=flat&logo=express&logoColor=black) | Servidor que processará as requisições do site, como conexão com o Banco e criação de Gráficos |
| Banco de dados |  ![MySQL](https://img.shields.io/badge/MySQL-7f7f7f?style=flat&logo=mysql&logoColor=white) + ![AmazonS3](https://img.shields.io/badge/AmazonS3-509e4b?style=flat&logo=amazons3&logoColor=white) | Armazenamento e manuseio de dados |
| Cloud e DevOps | ![AWS](https://img.shields.io/badge/AWS-ef7f10?style=flat&logo=amazonwebservices&logoColor=white) + ![Amazon EC2](https://img.shields.io/badge/AmazonEC2-ef6d10?style=flat&logo=amazonec2&logoColor=white) + ![IAM](https://img.shields.io/badge/AWSIAM-f4290b?style=flat&logo=awsiam&logoColor=white) + ![Amazon CloudWatch](https://img.shields.io/badge/AmazonCloudWatch-2790d8?style=flat&logo=amazoncloudwatch&logoColor=white) + ![Docker](https://img.shields.io/badge/Docker-2561da?style=flat&logo=docker&logoColor=white) + ![Nginx](https://img.shields.io/badge/Nginx-17782b?style=flat&logo=nginx&logoColor=white) + ![DuckDNS](https://img.shields.io/badge/DuckDNS-f5b100?style=flat&logo=duckdns&logoColor=white)| Hospedagem e Infraestrutura da Aplicação|

---
 
## Segurança e infraestrutura

Durante a implementação, foram adotadas práticas para proteger a comunicação entre os serviços:

Banco de dados RDS sem acesso público, com conexões restritas à aplicação.

Bucket S3 privado para armazenamento das capas.

IAM Role associada à EC2, evitando credenciais estáticas no código.

Security Groups para controlar as conexões entre os recursos.

Organização da rede utilizando VPC e subnets públicas e privadas.

---

## Monitoramento

O Amazon CloudWatch foi utilizado para acompanhar o comportamento da infraestrutura, incluindo:

Utilização de CPU da EC2.

Consumo de memória e disco.

Espaço de armazenamento disponível no Amazon RDS.

Alarmes para identificar possíveis problemas de utilização de recursos.
