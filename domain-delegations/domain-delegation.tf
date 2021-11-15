# OPS-REQ - 
module "-beescloud-com" {
  source   = "../modules/gcp-zone"
  zone_id  = data.aws_route53_zone.beescloud_com.zone_id
  hostname = "."
  ns       = "NaN"
}