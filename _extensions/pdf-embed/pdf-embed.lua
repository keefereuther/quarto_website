return {
  ['pdf-embed'] = function(args, kwargs)
    local pdf = pandoc.utils.stringify(args[1])
    local label = kwargs['label'] or ('PDF: ' .. pdf)
    local extra = kwargs['extra'] or ''
    local html = string.format(
      '<object data="%s" type="application/pdf" width="100%%" height="800" aria-label="%s">\n  <p>Your browser does not support embedded PDFs. <a href="%s">Download the PDF</a>%s</p>\n</object>',
      pdf,
      label,
      pdf,
      extra
    )
    return pandoc.RawBlock('html', html)
  end
}
