<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style>
        @page {
            margin-top: {
                    {
                    $branding['margins']['top']
                }
            }

            mm;

            margin-bottom: {
                    {
                    $branding['margins']['bottom']
                }
            }

            mm;

            margin-left: {
                    {
                    $branding['margins']['left']
                }
            }

            mm;

            margin-right: {
                    {
                    $branding['margins']['right']
                }
            }

            mm;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .header-image {
            width: 100%;
            height: auto;
            position: fixed;

            top: - {
                    {
                    $branding['margins']['top']
                }
            }

            mm;

            left: - {
                    {
                    $branding['margins']['left']
                }
            }

            mm;
            z-index: -1;
        }

        .custom-header {
            position: fixed;

            top: - {
                    {
                    $branding['margins']['top']
                }
            }

            mm;
            left: 0;
            width: 100%;
        }

        .footer {
            position: fixed;

            bottom: - {
                    {
                    $branding['margins']['bottom']
                }
            }

            mm;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #777;
        }

        .content {
            width: 100%;
        }

        /* Table Styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #eee;
        }

        th {
            background-color: #f9f9f9;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 10px;
        }

        .text-right {
            text-align: right;
        }

        .font-bold {
            font-weight: bold;
        }

        .mt-20 {
            margin-top: 20px;
        }
    </style>
</head>

<body>
    @if($branding['mode'] === 'Image')
    @foreach($branding['branding_assets'] as $asset)
    @if(isset($asset['full_path']))
    <img src="{{ $asset['full_path'] }}"
        style="position: fixed; 
                           top: {{ $asset['top'] - $branding['margins']['top'] }}mm; 
                           left: {{ $asset['left'] - $branding['margins']['left'] }}mm; 
                           width: {{ $asset['width'] ?? 50 }}mm; 
                           height: {{ $asset['height'] ?? 'auto' }};
                           opacity: {{ $asset['opacity'] ?? 1 }};
                           z-index: {{ $asset['z_index'] ?? 1 }};">
    @endif
    @endforeach
    @elseif($branding['mode'] === 'HTML' && $branding['header_html'])
    <div class="custom-header">
        {!! $branding['header_html'] !!}
    </div>
    @endif

    <div class="content">
        @include($content_view, $data)
    </div>

    <div class="footer">
        @if($branding['footer_html'])
        {!! $branding['footer_html'] !!}
        @else
        Page <span class="pagenum"></span> - {{ config('app.name') }}
        @endif
    </div>
</body>

</html>