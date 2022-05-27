# OPS-REQ - {{ values.subdomain }}
tj.beescloud.com
a

module "tj.beescloud.com-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "tj.beescloud.com."
  ns       = "a"
}