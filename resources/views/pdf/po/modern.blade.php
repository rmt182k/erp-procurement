<div class="purchase-order">
    <table style="border: none;">
        <tr style="border: none;">
            <td style="border: none; width: 50%;">
                <h1 style="color: #4f46e5; margin: 0;">PURCHASE ORDER</h1>
                <p style="color: #666; font-size: 14px;">#{{ $po->doc_number }}</p>
            </td>
            <td style="border: none; width: 50%; text-align: right;">
                <p class="font-bold" style="margin: 0;">{{ config('app.name') }}</p>
                <p style="margin: 2px 0;">Order Date: {{ $po->order_date->format('d M Y') }}</p>
                <p style="margin: 2px 0;">Status: <span style="text-transform: uppercase;">{{ $po->status }}</span></p>
            </td>
        </tr>
    </table>

    <table style="margin-top: 20px;">
        <thead>
            <tr>
                <th style="width: 50%;">VENDOR Information</th>
                <th style="width: 50%;">SHIP TO Information</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <p class="font-bold">{{ $po->vendor->name }}</p>
                    <p>{{ $po->vendor->address }}</p>
                    <p>Contact: {{ $po->vendor->contact_person }}</p>
                    <p>Email: {{ $po->vendor->email }}</p>
                </td>
                <td>
                    <p class="font-bold">{{ $po->costCenter->name }}</p>
                    <p>{{ $po->shipping_address ?? 'Central Warehouse' }}</p>
                </td>
            </tr>
        </tbody>
    </table>

    <table class="mt-20">
        <thead>
            <tr>
                <th style="width: 5%;">#</th>
                <th style="width: 45%;">Item Description</th>
                <th style="width: 10%;" class="text-right">Qty</th>
                <th style="width: 20%;" class="text-right">Unit Price</th>
                <th style="width: 20%;" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($po->items as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
                    <p class="font-bold" style="margin: 0;">{{ $item->item->name }}</p>
                    @if($item->notes)
                    <p style="margin: 2px 0; font-size: 10px; color: #666;">{{ $item->notes }}</p>
                    @endif
                </td>
                <td class="text-right">{{ number_format($item->quantity, 2) }}</td>
                <td class="text-right">{{ $po->currency->symbol }} {{ number_format($item->unit_price, 2) }}</td>
                <td class="text-right">{{ $po->currency->symbol }} {{ number_format($item->quantity * $item->unit_price, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <table style="border: none; margin-top: 10px;">
        <tr style="border: none;">
            <td style="border: none; width: 60%;">
                <p class="font-bold">Notes / Instructions:</p>
                <p style="font-size: 11px;">{{ $po->notes ?? 'Thank you for your business!' }}</p>
            </td>
            <td style="border: none; width: 40%;">
                <table style="border: none;">
                    <tr style="border: none;">
                        <td style="border-bottom: 1px solid #eee;">Subtotal</td>
                        <td class="text-right" style="border-bottom: 1px solid #eee;">{{ $po->currency->symbol }} {{ number_format($po->subtotal, 2) }}</td>
                    </tr>
                    <tr style="border: none;">
                        <td style="border-bottom: 1px solid #eee;">Tax (PPN)</td>
                        <td class="text-right" style="border-bottom: 1px solid #eee;">{{ $po->currency->symbol }} {{ number_format($po->tax_amount, 2) }}</td>
                    </tr>
                    @if($po->discount_amount > 0)
                    <tr style="border: none;">
                        <td style="border-bottom: 1px solid #eee;">Discount</td>
                        <td class="text-right" style="border-bottom: 1px solid #eee;">- {{ $po->currency->symbol }} {{ number_format($po->discount_amount, 2) }}</td>
                    </tr>
                    @endif
                    <tr style="border: none; font-size: 16px; font-weight: bold;">
                        <td>TOTAL</td>
                        <td class="text-right">{{ $po->currency->symbol }} {{ number_format($po->grand_total, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    @if($po->exchange_rate != 1.0)
    <p style="font-size: 10px; color: #999; text-align: right; margin-top: 10px;">
        Converted at rate: 1 {{ $po->currency_code }} = {{ number_format($po->exchange_rate, 2) }} IDR
    </p>
    @endif

    <div style="margin-top: 50px;">
        <table style="border: none;">
            <tr style="border: none;">
                <td style="border: none; width: 33%; text-align: center;">
                    <p>Ordered By,</p>
                    <div style="height: 60px;"></div>
                    <p class="font-bold">{{ $po->creator->name }}</p>
                </td>
                <td style="border: none; width: 33%; text-align: center;">
                    <p>Approved By,</p>
                    <div style="height: 60px;"></div>
                    <p class="font-bold">{{ $po->approver->name ?? '.................' }}</p>
                </td>
                <td style="border: none; width: 33%; text-align: center;">
                    <p>Vendor Acceptance,</p>
                    <div style="height: 60px;"></div>
                    <p class="font-bold">.................</p>
                </td>
            </tr>
        </table>
    </div>
</div>