data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "lambda_s3_permissions" {
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:PutObjectTagging",
      "s3:PutObjectAcl",
      "s3:ListBucket",
    ]

    resources = [
      "arn:aws:s3:::tzwolak.com",
      "arn:aws:s3:::tzwolak.com/*"
    ]
  }
}

resource "aws_iam_policy" "lambda_s3_permissions" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_s3_permissions.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_s3_permissions.arn
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "sota-summits-processor/."
  output_path = "sota-summits-processor-lambda.zip"
}

resource "aws_lambda_function" "sota-summits-processor" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = "sota-summits-processor-lambda.zip"
  function_name = "sota-summits-processor"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs18.x"

  timeout     = 120
  memory_size = 2048

  environment {
    variables = {
      foo = "bar"
    }
  }
}

resource "aws_cloudwatch_event_rule" "update_summits" {
  name                = "update_summits"
  description         = "update summits geojson nightly"
  # schedule_expression = "cron(26 8 * * * *)"
  schedule_expression = "cron(26 8 * * ? *)"
}
resource "aws_cloudwatch_event_target" "update_summits" {
  rule      = aws_cloudwatch_event_rule.update_summits.name
  target_id = "lambda"
  arn       = aws_lambda_function.sota-summits-processor.arn
}
resource "aws_lambda_permission" "cw_call_update_summits" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sota-summits-processor.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.update_summits.arn
}
