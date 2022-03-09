# OPS-REQ - {{ values.subdomain }}
test.baguette.cloudbees.com
c

module "test.baguette.cloudbees.com-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "test.baguette.cloudbees.com."
  ns       = "c"
}