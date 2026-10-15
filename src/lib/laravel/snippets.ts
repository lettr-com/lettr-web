/*
 * PHP shown on /laravel. Checked against lettr/lettr-laravel 2.8.0 and
 * php -l: `LettrMailable` takes the template from `$templateSlug` and the
 * merge tags from `withMergeTags()`, and the DTO and enum match what
 * `lettr:generate-dtos` and `lettr:generate-enum` write.
 */

export interface Snippet {
  /** Path shown above the code. */
  path: string;
  code: string;
}

export const orderShippedMailable: Snippet = {
  path: "app/Mail/OrderShipped.php",
  code: String.raw`<?php

namespace App\Mail;

use App\Dto\Lettr\OrderShippedData;
use Illuminate\Mail\Mailables\Envelope;
use Lettr\Laravel\Mail\LettrMailable;

class OrderShipped extends LettrMailable
{
    // The design lives in Lettr. Edit it in the dashboard, no deploy needed.
    protected ?string $templateSlug = 'order-shipped';

    public function __construct(
        public OrderShippedData $data,
    ) {}

    // No subject here, so the subject set on the template in Lettr is used.
    public function envelope(): Envelope
    {
        return new Envelope;
    }

    /**
     * Merge tags sent to the Lettr template.
     *
     * @return array<string, mixed>
     */
    public function withMergeTags(): array
    {
        return $this->data->toArray();
    }
}`,
};

export const shipOrderCall: Snippet = {
  path: "app/Http/Controllers/ShipmentController.php",
  code: String.raw`use App\Dto\Lettr\OrderShippedData;
use App\Mail\OrderShipped;
use Illuminate\Support\Facades\Mail;

// Queued, so a retried job replays the original send instead of a second email.
Mail::to($order->customer->email)->queue(new OrderShipped(
    new OrderShippedData(
        customerName: $order->customer->name,
        orderNumber: $order->number,
        trackingUrl: $order->tracking_url,
    ),
));`,
};

export const templateEnum: Snippet = {
  path: "app/Enums/LettrTemplate.php, generated",
  code: String.raw`<?php

declare(strict_types=1);

namespace App\Enums;

enum LettrTemplate: string
{
    case OrderShipped = 'order-shipped';
    case PasswordReset = 'password-reset';
    case WelcomeEmail = 'welcome-email';
}`,
};

export const orderShippedDto: Snippet = {
  path: "app/Dto/Lettr/OrderShippedData.php, generated",
  code: String.raw`<?php

declare(strict_types=1);

namespace App\Dto\Lettr;

use Illuminate\Contracts\Support\Arrayable;

final readonly class OrderShippedData implements Arrayable
{
    public function __construct(
        public string $customerName,
        public string $orderNumber,
        public string $trackingUrl,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'customer_name' => $this->customerName,
            'order_number' => $this->orderNumber,
            'tracking_url' => $this->trackingUrl,
        ];
    }
}`,
};

export const idempotentSyncSend = String.raw`// Sending synchronously? Pass your own key.
Mail::lettr()
    ->to($order->customer->email)
    ->idempotencyKey("order-{$order->id}-shipped")
    ->send(new OrderShipped($data));`;

export const smtpEnv = `MAIL_MAILER=smtp
MAIL_HOST=smtp.lettr.com
MAIL_PORT=587
MAIL_USERNAME=lettr
MAIL_PASSWORD=your-lettr-api-key`;
